import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectedResolver(async (_, { offset }, { loginUser, client }) => {
      return await client.photo.findMany({
        take: 2,
        skip: offset,
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
