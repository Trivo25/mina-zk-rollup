import 'dotenv/config';
import { getServer } from './server.js';
import log from '../../lib/log/index.js';
import { Prover } from '../../proof_system/prover.js';
import { isReady } from 'snarkyjs';

const start = async (port: number = 3000) => {
  await isReady;

  log.info('Preparing worker node..');

  log.info('Compiling latest prover');
  // await Prover.compile();
  log.info('Prover compiled');

  log.info(`Starting RPC server on port ${port}`);
  const server = getServer();
  server.http().listen(port);
};

start(3000);

start(3001);

start(3002);
