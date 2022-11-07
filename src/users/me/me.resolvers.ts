import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolvers: Resolvers = {
  Query: {
    me: protectedResolver((_, __, { loginUser, client }) =>
      client.user.findUnique({
        where: {
          id: loginUser.id,
        },
      })
    ),
  },
};

export default resolvers;
