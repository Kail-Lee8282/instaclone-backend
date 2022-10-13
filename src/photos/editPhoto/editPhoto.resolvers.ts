import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

const resolvers: Resolvers = {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loginUser, client }) => {
        const oldPhoto = await client.photo.findFirst({
          where: {
            id,
            userId: loginUser.id,
          },
          include: {
            hashtags: {
              select: {
                hashtag: true,
              },
            },
          },
        });

        if (!oldPhoto) {
          return {
            ok: false,
            error: "Photo not found.",
          };
        }

        const photo = await client.photo.update({
          where: {
            id,
          },
          data: {
            caption,
            hashtags: {
              disconnect: oldPhoto.hashtags,
              connectOrCreate: processHashtags(caption),
            },
          },
        });

        if (photo) {
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
            error: "Failed to update photo caption",
          };
        }
      }
    ),
  },
};

export default resolvers;
