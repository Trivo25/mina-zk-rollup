import 'dotenv/config';
import { getServer } from './server.js';
import log from '../../lib/log/index.js';
import { Prover } from '../../proof_system/prover.js';
import { isReady } from 'snarkyjs';

const start = async () => {
  await isReady;

  log.info('Preparing worker node..');

  log.info('Compiling latest prover');
  // await Prover.compile();
  log.info('Prover compiled');

  log.info('Starting RPC server');
  const server = getServer();
  server.http().listen(3000);
};

start();
