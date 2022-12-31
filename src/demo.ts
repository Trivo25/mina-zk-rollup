import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import { isReady } from 'snarkyjs';
import { zkRollup } from './create_rollup.js';
import { Schema } from './rollup_operator/controllers/schema.js';
import { Resolvers } from './rollup_operator/controllers/resolvers.js';
import http from 'http';

await isReady;

/* class MyContract extends SmartContract {
  @method update(x: Field) {
    x.add(2).add(5).sub(2);
    Poseidon.hash([Field.zero]).equals(Poseidon.hash([Field.zero]));
    Poseidon.hash([Field.zero]).assertEquals(Poseidon.hash([Field.zero]));
  }
}

let feePayer = PrivateKey.random().toBase58();
let contractAddress = PrivateKey.random().toBase58();

const Rollup = await zkRollup(MyContract, feePayer, contractAddress);
await Rollup.start(4000); */

const app = express();
app.use(cors());
const httpServer = http.createServer(app);

const resolvers = Resolvers();

const graphql = new ApolloServer({
  typeDefs: Schema,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
}) as any;

await graphql.start();
console.log('started');
graphql.applyMiddleware({ app });
await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);
