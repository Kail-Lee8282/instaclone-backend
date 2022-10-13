import { uploadToS3 } from "../../shared/shared.utils";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loginUser, client }) => {
        let hashtagObjs = null;
        if (caption) {
          // // parse caption
          // const hashtag = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g) as [
          //   String
          // ];

          // // create hashtags
          // hashtagObjs = hashtag.map((hashtag) => ({
          //   where: {
          //     hashtag,
          //   },
          //   create: {
          //     hashtag,
          //   },
          // }));

          hashtagObjs = processHashtags(caption);
        }

        const fileUrl = await uploadToS3(file, loginUser.id, "uploads");

        return client.photo.create({
          data: {
            file: fileUrl,
            caption,
            user: {
              connect: {
                id: loginUser.id,
              },
            },
            ...(hashtagObjs.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObjs,
              },
            }),
          },
        });

        // save photo with the parsed hashtags
        // add the photo to the hashtags
      }
    ),
  },
};
