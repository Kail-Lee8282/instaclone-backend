import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    createComment: protectedResolver(
      async (_, { photoId, payload }, { loginUser, client }) => {
        const ok = await client.photo.findUnique({
          where: {
            id: photoId,
          },
          select: {
            id: true,
          },
        });

        if (!ok) {
          return {
            ok: false,
            error: "Photo not found.",
          };
        }

        const newComment = await client.comment.create({
          data: {
            payload,
            photo: {
              connect: {
                id: photoId,
              },
            },
            user: {
              connect: {
                id: loginUser.id,
              },
            },
          },
        });

        return {
          ok: true,
          id: newComment.id,
        };
      }
    ),
  },
};

export default resolvers;
