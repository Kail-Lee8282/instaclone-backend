require("dotenv").config(); //환경변수를 .env 파일 저장하고 process.env로 로드
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import logger from "morgan";
import { graphqlUploadExpress } from "graphql-upload";
import client from "./client";
import pubsub from "./pubsub";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: async ({ req }) => {
//     return {
//       loginUser: await getUser(req.headers.token),
//       //protectResolver
//     };
//   },
// });

// const PORT = process.env.PORT;

// const app = express();

// server.start();
// server.applyMiddleware({ app });
// app.use(logger("tiny"));
// app.listen({ port: PORT }, () => {
//   console.log(`🚀 server is running http://localhost:${PORT} ✅`);
// });

//.then(({ url }) => console.log(`🚀 server is running ${url} ✅`));

const PORT = process.env.PORT;

async function startApolloServer() {
  const app = express();
  app.use(logger("tiny"));
  app.use(graphqlUploadExpress());
  app.use("/static", express.static("uploads"));

  const httpServer = createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        if (!ctx.connectionParams?.token) {
          return { loginUser: null };
        }

        const user = await getUser(ctx.connectionParams.token);
        return {
          loginUser: user,
        };
      },

      onConnect: (ctx) => {
        // if (!ctx.connectionParams?.token) {
        //   throw new Error("Authorized not found.");
        // }
        if (ctx.connectionParams && !ctx.connectionParams.token) {
          console.log("onConnect", ctx);
          throw new Error("Authorized not found.");
        }
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      return {
        loginUser: await getUser(req.headers.token),
        client,
      };
    },
    plugins: [
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  server.applyMiddleware({ app });

  // await new Promise<void>((resolve) => app.listen({ port: PORT }, resolve));
  // console.log(
  //   `🚀 server is running http://localhost:${PORT}${server.graphqlPath} ✅`
  // );
  httpServer.listen(PORT, () => {
    console.log(
      `🚀 server is running http://localhost:${PORT}${server.graphqlPath} ✅`
    );
  });
}

startApolloServer();
