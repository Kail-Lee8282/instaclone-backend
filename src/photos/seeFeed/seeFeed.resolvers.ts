import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectedResolver(async (_, __, { loginUser, client }) => {
      return await client.photo.findMany({
        where: {
          OR: [
            {
              user: {
                followers: {
                  some: {
                    id: loginUser.id,
                  },
                },
              },
            },
            {
              userId: loginUser.id,
            },
          ],
        },
        orderBy: {
          createAt: "desc",
        },
      });
    }),
  },
};

export default resolvers;
