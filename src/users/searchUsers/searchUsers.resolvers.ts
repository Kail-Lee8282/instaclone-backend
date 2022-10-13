const resolvers = {
  Query: {
    searchUsers: async (_, { keyword }, { client }) =>
      client.user.findMany({
        where: {
          userName: {
            startsWith: keyword,
          },
        },
      }),
  },
};

export default resolvers;
