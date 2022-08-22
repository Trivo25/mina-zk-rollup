import * as grpc from '@grpc/grpc-js';
import { Msg } from '../protos_gen/msg.js';
import {
  IMsgSerivce,
  msgSerivceDefinition,
} from '../protos_gen/msg.grpc-server.js';

const host = '0.0.0.0:5000';

const exampleService: IMsgSerivce = {
  echo: function (
    call: grpc.ServerUnaryCall<Msg, Msg>,
    callback: grpc.sendUnaryData<Msg>
  ): void {
    let m: Msg = {
      name: '123',
      id: 1n,
      years: 1,
    };
    callback(null, m);
  },
};

function getServer(): grpc.Server {
  const server = new grpc.Server();
  server.addService(msgSerivceDefinition, exampleService);
  return server;
}

const server = getServer();
server.bindAsync(
  host,
  grpc.ServerCredentials.createInsecure(),
  (err: Error | null, port: number) => {
    if (err) {
      console.error(`Server error: ${err.message}`);
    } else {
      console.log(`Server bound on port: ${port}`);
      server.start();
    }
  }
);
