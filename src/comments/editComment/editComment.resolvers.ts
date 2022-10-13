import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    editComment: protectedResolver(
      async (_, { id, payload }, { loginUser, client }) => {
        const comment = await client.comment.findUnique({
          where: {
            id,
          },
          select: {
            userId: true,
          },
        });

        if (!comment) {
          return { ok: false, error: "Comment not found." };
        } else if (comment.userId !== loginUser.id) {
          return {
            ok: false,
            error: "Not authorized",
          };
        } else {
          await client.comment.update({
            data: {
              payload,
            },
            where: {
              id,
            },
          });

          return {
            ok: true,
          };
        }
      }
    ),
  },
};

export default resolvers;
