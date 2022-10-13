import { Resolvers } from "../types";

const resovlers: Resolvers = {
  Comment: {
    isMine: ({ userId }, _, { loginUser }) => {
      if (!loginUser) {
        return false;
      }
      return userId === loginUser.id;
    },
  },
};

export default resovlers;
