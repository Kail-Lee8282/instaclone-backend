import { protectedResolver } from "../users.utils";

const resolvers = {
  Mutation: {
    followUser: protectedResolver(
      async (_, { userName }, { loginUser, client }) => {
        const ok = await client.user.findUnique({
          where: {
            userName,
          },
        });

        if (!ok) {
          return {
            ok: false,
            error: "That user does not exist.",
          };
        }

        await client.user.update({
          where: {
            id: loginUser.id,
          },
          data: {
            following: {
              connect: {
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
