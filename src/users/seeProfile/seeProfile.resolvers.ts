import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeProfile: (_, { userName }, { client }) =>
      // Unique 필드만 찾음
      client.user.findUnique({
        where: {
          userName,
        },
        include: {
          following: true,
          followers: true,
        },
      }),
  },
};

export default resolvers;
