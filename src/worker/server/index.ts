import * as grpc from '@grpc/grpc-js';
import { getServer } from './server.js';

const server = getServer();
server.bindAsync(
  '0.0.0.0:5000',
  grpc.ServerCredentials.createInsecure(),
  (error: Error | null, port: number) => {
    server.start();
    if (error) {
      console.log('something went horribly wrong on port ', port);
    } else {
      console.log('server is running on port ', port);
    }
  }
);
