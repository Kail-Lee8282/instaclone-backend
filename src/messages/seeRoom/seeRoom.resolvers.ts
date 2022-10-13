import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    seeRoom: protectedResolver((_, { id }, { loginUser, client }) =>
      client.room.findFirst({
        where: {
          id,
          users: {
            some: {
              id: loginUser.id,
            },
          },
        },
      })
    ),
  },
};

export default resolvers;
