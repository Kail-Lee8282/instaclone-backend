import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { userName, password }, { client }) => {
      // find user with args.username
      const user = await client.user.findFirst({
        where: {
          userName,
        },
      });

      if (!user) {
        return { ok: false, error: "User not found." };
      }

      // check password with args.password
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return { ok: false, error: "Incorrect password" };
      }

      // issue a token and send it on thre user
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      };
    },
  },
};

export default resolvers;
