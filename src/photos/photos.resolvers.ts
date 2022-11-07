import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Photo: {
    user: ({ userId }, _, { client }) =>
      client.user.findUnique({
        where: {
          id: userId,
        },
      }),
    hashtags: ({ id }, _, { client }) =>
      client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id,
            },
          },
        },
      }),
    likes: ({ id }, _, { client }) =>
      client.like.count({
        where: {
          photoId: id,
        },
      }),
    commentCount: ({ id }, _, { client }) =>
      client.comment.count({
        where: {
          photoId: id,
        },
      }),
    comments: ({ id }, _, { client }) =>
      client.comment.findMany({
        where: {
          photoId: id,
        },
        include: {
          user: true,
        },
      }),
    isMine: ({ userId }, _, { loginUser }) => {
      if (!loginUser) {
        return false;
      }
      return userId === loginUser.id;
    },
    isLiked: async ({ id }, _, { loginUser, client }) => {
      if (!loginUser) {
        return false;
      }

      const ok = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId: id,
            userId: loginUser.id,
          },
        },
        select: {
          id: true,
        },
      });

      if (!ok) {
        return false;
      }
      return true;
    },
  },
  Hashtag: {
    photos: ({ id }, { page }, { client }) => {
      return client.hashtag
        .findUnique({
          where: {
            id,
          },
        })
        .photos({
          take: 5,
          skip: (page - 5) * 5,
        });
    },
    totalPhotos: ({ id }, _, { client }) =>
      client.photo.count({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        },
      }),
  },
};

export default resolvers;
