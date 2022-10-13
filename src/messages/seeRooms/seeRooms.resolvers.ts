import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    seeRooms: protectedResolver((_, __, { loginUser, client }) =>
      client.room.findMany({
        where: {
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
