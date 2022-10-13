import { protectedResolver } from "../users.utils";

const resolvers = {
  Mutation: {
    unfollowUser: protectedResolver(
      async (_, { userName }, { loginUser, client }) => {
        const ok = await client.user.findUnique({
          where: {
            userName,
          },
        });

        if (!ok) {
          return {
            ok: false,
            error: "Can't unfollow user.",
          };
        }

        await client.user.update({
          where: {
            id: loginUser.id,
          },
          data: {
            following: {
              disconnect: {
                userName,
              },
            },
          },
        });

        return {
          ok: true,
        };
      }
    ),
  },
};

export default resolvers;
