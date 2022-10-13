import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    toggleLike: protectedResolver(async (_, { id }, { loginUser, client }) => {
      const photo = await client.photo.findUnique({
        where: {
          id,
        },
      });

      if (!photo) {
        return {
          ok: false,
          error: "Photo not found.",
        };
      }

      const likeWhere = {
        photoId_userId: {
          userId: loginUser.id,
          photoId: id,
        },
      };
      const like = await client.like.findUnique({
        where: likeWhere,
      });

      if (like) {
        await client.like.delete({
          where: likeWhere,
        });
      } else {
        await client.like.create({
          data: {
            user: {
              connect: {
                id: loginUser.id,
              },
            },
            photo: {
              connect: {
                id: photo.id,
              },
            },
          },
        });
      }

      return {
        ok: true,
      };
    }),
  },
};

export default resolvers;
