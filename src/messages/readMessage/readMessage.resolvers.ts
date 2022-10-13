import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    readMessage: protectedResolver(async (_, { id }, { loginUser, client }) => {
      const message = await client.message.findFirst({
        where: {
          id,
          userId: {
            not: loginUser.id,
          },
          room: {
            users: {
              some: {
                id: loginUser.id,
              },
            },
          },
        },
        select: {
          id: true,
        },
      });

      if (!message) {
        return {
          ok: false,
          error: "Message not found.",
        };
      }

      await client.message.update({
        where: {
          id,
        },
        data: {
          read: true,
        },
      });

      return {
        ok: true,
      };
    }),
  },
};

export default resolvers;
