import { withFilter } from "graphql-subscriptions";
import client from "../client";
import { NEW_MESSAGE } from "../constants";
import pubsub from "../pubsub";
import { Resolvers } from "../types";

const resolvers = {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        // Listen before
        // 채팅방 존재 여부 체크
        const room = await client.room.findFirst({
          where: {
            id: args.id,
            users: {
              some: {
                id: context.loginUser.id,
              },
            },
          },
          select: {
            id: true,
          },
        });

        if (!room) {
          throw new Error("You shall not see this.");
        }

        // 받은 메시지가 같은 채팅방인지 체크
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async ({ roomUpdates }, { id }, { loginUser }) => {
            // Listen after

            if (roomUpdates.roomId === id) {
              const room = await client.room.findFirst({
                where: {
                  id: args.id,
                  users: {
                    some: {
                      id: context.loginUser.id,
                    },
                  },
                },
                select: {
                  id: true,
                },
              });

              if (!room) {
                return false;
              }
              return true;
            }
          }
        )(root, args, context, info);
      },
    },
  },
};

export default resolvers;
