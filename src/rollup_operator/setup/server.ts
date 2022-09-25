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
import { RollupAccount, RollupState } from '../../proof_system';
import { Field, isReady, PrivateKey, UInt32, UInt64 } from 'snarkyjs';
import { Prover } from '../../proof_system/prover';
import logger from '../../lib/log';
import { setupContract } from '../contract';

import { AccountMerkleProof } from '../../lib/merkle_proof';
import DepositStore from '../../lib/data_store/DepositStore';

// ! for demo purposes only
const setupDemoStore = async () => {
  let store = new AccountStore();
  let raw = [
    {
      publicKey: 'B62qpkPHkmoG73CdpDxHzNVkYse7vRH13jwNjcM3sgCVcJt5az64Aru',
      privateKey: 'EKEfcsQRnT4FDeu2jKWFQJB168GAqZyPiVhC5dvTgSsFsAozXPaG',
    },
    {
      publicKey: 'B62qmh1etPvw576SaENiQvD9sMURNfQ4B6fCXLHWzhuzSiAHkycr8NS',
      privateKey: 'EKF6PAAbpxkxYofq5JM4wpzRgCBGGZ5FJg6785ZyGFhwLBxCe5w5',
    },
    {
      publicKey: 'B62qm1P3vvQQq2Ro6xyNf8bBLyExHxiG3B45dTiNFcfimNnS1rTeicW',
      privateKey: 'EKFTGFrC4AKoaHfvFgoya4sYUfq3wu2zDwDqZBXrPVm6RpRffchb',
    },
    {
      publicKey: 'B62qqdakgumxVsGXfB5ouwHwthaWy8ZZPedjCRcRgk8aGp72R82zC2G',
      privateKey: 'EKDmSSoryde5ZEY9W9koA2BYL7PgDJLjZYuv6s9Mc2SkSZE1hmAu',
    },
  ];

  raw.forEach((e, i) => {
    let acc = new RollupAccount(
      UInt64.from(10000),
      UInt32.from(0),
      PrivateKey.fromBase58(e.privateKey).toPublicKey(),
      AccountMerkleProof.empty()
    );
    store.set(BigInt(i), acc);
  });

  let depositStore = new DepositStore();

  return { store, depositStore };
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
    pendingDeposits: demo.depositStore,
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
