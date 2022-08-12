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
import { KeyedDataStore } from '../../lib/data_store';
import {
  RollupAccount,
  RollupState,
  RollupStateTransition,
} from '../proof_system';
import {
  Field,
  isReady,
  Mina,
  Party,
  PrivateKey,
  PublicKey,
  Signature,
  UInt32,
  UInt64,
} from 'snarkyjs';
import { MerkleProof } from '../../lib/merkle_proof';
import {} from 'crypto';
import { Prover, RollupStateTransitionProof } from '../proof_system/prover';
import { ContractInterface } from '../blockchain';
import { RollupZkApp } from '../../zkapp/RollupZkApp';
import logger from '../../lib/log';
import MerkleList from '../proof_system/models/Deposits';

import Config from '../../config/config';
// ! for demo purposes only
const setupDemoStore = async () => {
  await isReady;
  let accounts = new Map<string, RollupAccount>();

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

  raw.forEach((entry) => {
    let acc = new RollupAccount(
      UInt64.fromNumber(1000000),
      UInt32.fromNumber(0),
      PublicKey.fromBase58(entry.publicKey),
      MerkleProof.fromElements([])
    );

    accounts.set(entry.publicKey, acc);

    // making sure conversion went right
    let sig = Signature.create(PrivateKey.fromBase58(entry.privateKey), [
      Field.zero,
    ]);
    sig
      .verify(PublicKey.fromBase58(entry.publicKey), [Field.zero])
      .assertTrue();
  });

  let store = new KeyedDataStore<string, RollupAccount>();
  store.fromData(accounts);
  return { store, raw };
};

const setupLocalContract = async (): Promise<ContractInterface> => {
  let feePayer = PrivateKey.fromBase58(Config.accounts.feePayer.privateKey);
  let zkappKey = PrivateKey.fromBase58(Config.accounts.zkApp.privateKey);

  let Instance;
  await RollupZkApp.compile(zkappKey.toPublicKey());
  let zkapp = new RollupZkApp(zkappKey.toPublicKey());
  if (Config.graphql.remote) {
    Instance = Mina.BerkeleyQANet(Config.graphql.endpoint);
  } else {
    // setting up local contract
    Instance = Mina.LocalBlockchain();
  }
  Mina.setActiveInstance(Instance);

  return {
    async submitProof(
      stateTransition: RollupStateTransition,
      stateTransitionProof: RollupStateTransitionProof
    ) {
      let tx = await Mina.transaction(
        { feePayerKey: feePayer, fee: 100_000_000 },
        () => {
          zkapp.verifyBatch(stateTransitionProof, stateTransition);
          zkapp.sign(zkappKey);
        }
      );
      await tx.prove();
      let res = await tx.send().wait();
      console.log('proof submitted !!!!!!!!');
      console.log(JSON.stringify(res));
    },
  };
};

interface Application {
  express: express.Application;
  rollupService: RollupService;
}

async function setupServer(): Promise<Application> {
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
  let contract = await setupLocalContract();
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
