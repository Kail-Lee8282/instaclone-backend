const resolvers = {
  Query: {
    seeFollowers: async (_, { userName, page }, { client }) => {
      const ok = await client.user.findUnique({
        where: { userName },
        select: { id: true },
      });

      if (!ok) {
        return {
          ok: false,
          error: "Not found user",
        };
      }

      // offset base pagination
      const followers = await client.user
        .findUnique({
          where: {
            userName,
          },
        })
        .followers({
          take: 5,
          skip: (page - 1) * 5,
        });

      // followers 개 수 조회
      const totalFollowers = await client.user.count({
        where: {
          following: {
            some: {
              userName,
            },
          },
        },
      });

      /*
            const bFollowers = await client.user.findMany({
                where:{
                    following:{
                        some:{
                            userName,
                        }
                    }
                }
            });
            console.log(bFollowers[0]);
            */

      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5),
      };
    },
  },
};

export default resolvers;
