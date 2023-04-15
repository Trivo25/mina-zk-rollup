import { SmartContract } from 'snarkyjs';
import GlobalEventHandler from '../events/gobaleventhandler.js';
import { RollupService } from './RollupService.js';
import { GlobalState } from './Service.js';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { Schema } from '../controllers/schema.js';
import { Resolvers } from '../controllers/resolvers.js';
export { setupService };

function setupService(
  globalState: GlobalState,
  p: any,
  contract: typeof SmartContract
) {
  const app = express();
  app.use(cors());
  const httpServer = http.createServer(app);

  const rs = new RollupService(globalState, GlobalEventHandler, p, contract);

  const resolvers = Resolvers(rs);

  const graphql = new ApolloServer({
    typeDefs: Schema,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  }) as any;

  return {
    async start(port: number) {
      await graphql.start();
      graphql.applyMiddleware({ app });
      await new Promise<void>((resolve) =>
        httpServer.listen({ port }, resolve)
      );
    },
  };
}
