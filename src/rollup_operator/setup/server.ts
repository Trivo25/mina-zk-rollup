import express from 'express';
import bodyParser from 'body-parser';
import setRoutes from './routes';
import cors from 'cors';

import RollupController from '../controllers/RollupController';
import RollupService from '../services/RollupService';
import QueryController from '../controllers/QueryController';
import QueryService from '../services/QueryService';

import { DataStore } from '../data_store';
import { GlobalEventHandler } from '../events';
import { AccountStore } from '../../lib/data_store';
import { RollupAccount, RollupState } from '../proof_system';
import { Field, isReady } from 'snarkyjs';
import { Prover } from '../proof_system/prover';
import logger from '../../lib/log';
import MerkleList from '../proof_system/models/Deposits';
import { setupContract } from '../contract';

import Config from '../../config/config';

// ! for demo purposes only
const setupDemoStore = async () => {
  let store = new AccountStore(Config.ledgerHeight);

  for (let index = 0; index < Config.ledgerHeight; index++) {
    store.set(BigInt(index), RollupAccount.empty());
  }

  return { store };
};

interface Application {
  express: express.Application;
  rollupService: RollupService;
}

async function setupServer(): Promise<Application> {
  await isReady;
  const server = express();
  server.use(cors());
  server.use(bodyParser.json());

  logger.info('Setting up store');
  let demo = await setupDemoStore();

  let globalStore: DataStore = {
    accountTree: demo.store,
    transactionPool: [],
    transactionHistory: [],
    pendingDeposits: new MerkleList([]),
    state: {
      committed: new RollupState(
        Field.zero,
        Field.fromString(demo.store.getMerkleRoot()!.toString()!)
      ),
      current: new RollupState(
        Field.zero,
        Field.fromString(demo.store.getMerkleRoot()!.toString()!)
      ),
    },
  };

  try {
    logger.info('Compiling Prover');
    await Prover.compile();
    logger.info('Prover Compiled');
  } catch (error) {
    logger.error(error);
  }

  logger.info('Setting up Contract');
  let contract = await setupContract();
  logger.info('Contract set up');

  let rs = new RollupService(globalStore, GlobalEventHandler, Prover, contract);
  let rc = new RollupController(rs);
  let qc = new QueryController(
    new QueryService(globalStore, GlobalEventHandler)
  );

  setRoutes(server, rc, qc);
  return {
    express: server,
    rollupService: rs,
  };
}
export default setupServer();
