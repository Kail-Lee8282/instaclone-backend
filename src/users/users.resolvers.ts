export default {
  User: {
    totalFollowing: ({ id }, _, { client }) =>
      client.user.count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      }),
    totalFollowers: ({ id }, _, { client }) =>
      client.user.count({
        where: {
          following: {
            some: {
              id,
            },
          },
        },
      }),
    isMe: ({ id }, _, { loginUser }) => {
      if (!loginUser) {
        return false;
      }
      return id === loginUser.id;
    },
    photos: ({ id }, _, { client }) =>
      client.user
        .findUnique({
          where: {
            id,
          },
        })
        .photos(),
    isFollowing: async ({ id }, _, { loginUser, client }) => {
      if (!loginUser) {
        return false;
      }

      //   const exists = await client.user
      //     .findUnique({ where: { userName: loginUser.userName } })
      //     .following({
      //       where: {
      //         id,
      //       },
      //     });
      const exists = await client.user.count({
        where: {
          userName: loginUser.userName,
          following: {
            some: {
              id,
            },
          },
        },
      });

      return Boolean(exists);
    },
  },
};
