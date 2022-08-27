import * as grpc from '@grpc/grpc-js';
import { proverServiceDefinition } from '../protos_gen/prover.grpc-server.js';
import { service } from './service.js';
console.log(process.env.SEQUENCER_REST_PORT);
export function getServer(): grpc.Server {
  const server = new grpc.Server();
  server.addService(proverServiceDefinition, service);
  return server;
}
