import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Room: {
    users: ({ id }, _, { client }) =>
      client.room
        .findUnique({
          where: {
            id,
          },
        })
        .users(),
    messages: ({ id }, _, { client }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
      }),
    unReadTotal: async ({ id }, __, { loginUser, client }) => {
      if (!loginUser) {
        return 0;
      }

      // 자신이 보낸 메시지 제외
      return await client.message.count({
        where: {
          read: false,
          roomId: id,
          user: {
            id: {
              not: loginUser.id,
            },
          },
        },
      });
    },
  },
  Message: {
    user: ({ id }, _, { client }) =>
      client.message
        .findUnique({
          where: {
            id,
          },
        })
        .user(),
  },
};

export default resolvers;
