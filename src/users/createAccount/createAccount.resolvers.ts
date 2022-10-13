import bcrypt from "bcrypt";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, userName, email, password },
      { client }
    ) => {
      try {
        // check if username or email are already on DB
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                userName,
              },
              {
                email,
              },
            ],
          },
        });

        if (existingUser) {
          throw new Error("This username/email is already taken.");
        }

        // hash password
        const hashPassword = await bcrypt.hash(password, 10);

        //  save and return the user
        await client.user.create({
          data: {
            firstName,
            lastName,
            userName,
            email,
            password: hashPassword,
          },
        });

        return {
          ok: true,
        };
      } catch (err) {
        return {
          ok: false,
          error: "Can't create account.",
        };
      }
    },
  },
};

export default resolvers;
