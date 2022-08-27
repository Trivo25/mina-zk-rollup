import * as grpc from '@grpc/grpc-js';
import 'dotenv/config';
import { getServer } from './server.js';
import log from '../../lib/log/index.js';
import { Prover } from '../../proof_system/prover.js';
import { isReady } from 'snarkyjs';

const start = async () => {
  await isReady;

  log.info('Preparing worker node..');

  log.info('Compiling latest prover');
  await Prover.compile();
  log.info('Prover compiled');

  log.info('Starting RPC server');
  const server = getServer();
  server.bindAsync(
    '0.0.0.0:5000',
    grpc.ServerCredentials.createInsecure(),
    (error: Error | null, port: number) => {
      server.start();
      if (error) {
        log.error(`Something went horribly wrong on port ${port}`);
      } else {
        log.info(`Server is running on port ${port}`);
      }
    }
  );
};

start();
