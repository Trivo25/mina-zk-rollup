import express from 'express';
import bodyParser from 'body-parser';
import setRoutes from './routes';
import cors from 'cors';

import RollupController from '../controllers/RollupController';
import RollupService from '../services/RollupService';
import QueryController from '../controllers/QueryController';
import QueryService from '../services/QueryService';

import { DataStore } from '../data_store';
import { Events, GlobalEventHandler } from '../events';
import { KeyedDataStore } from '../../lib/data_store';
import { RollupAccount } from '../proof_system';
import {
  Field,
  isReady,
  PrivateKey,
  PublicKey,
  Signature,
  UInt32,
  UInt64,
} from 'snarkyjs';
import { MerkleProof } from '../../lib/merkle_proof';
import { ITransaction } from '../../lib/models';
import {} from 'crypto';
import { signTx } from '../../client_sdk';
import { Prover } from '../proof_system/TransitionProver';
// ! for demo purposes only
const setupDemoStore = async () => {
  await isReady;
  let accounts = new Map<string, RollupAccount>();

  let raw = [
    {
      publicKey: 'B62qknga8UzXgEm4Zup2FhNh8gxkMygt63Z5SQzqce4xkCLwHCRVusD',
      privateKey: 'EKEnt7fD5HWNdf2nJ82VmA1kmywc6Rhh1u1HNZ5uMn72fk7wMFhe',
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

const testRun = (
  rc: RollupController,
  qc: any,
  from: any,
  to: any,
  nonce: number
) => {
  let tx: ITransaction = {
    from: from.publicKey,
    to: to.publicKey,
    amount: '100',
    nonce: nonce.toString(),
    tokenId: '0',
    signature: {
      r: '1',
      s: '1',
    },
  };

  tx = signTx(tx, PrivateKey.fromBase58(from.privateKey));
  rc.service.processTransaction(tx);
};

interface Application {
  express: express.Application;
}

async function setupServer(): Promise<Application> {
  const server = express();
  server.use(cors());
  server.use(bodyParser.json());

  //let globalStore = new LevelStore('./db');
  let demo = await setupDemoStore();

  let globalStore: DataStore = {
    accountTree: demo.store,
    transactionPool: [],
    transactionHistory: [],
  };

  try {
    await Prover.compile();
  } catch (error) {
    console.log(error);
  }
  console.log('Prover compiled');
  let rc = new RollupController(
    new RollupService(globalStore, GlobalEventHandler, Prover)
  );
  let qc = new QueryController(
    new QueryService(globalStore, GlobalEventHandler)
  );
  testRun(rc, qc, demo.raw[0], demo.raw[1], 0);
  testRun(rc, qc, demo.raw[0], demo.raw[2], 1);
  testRun(rc, qc, demo.raw[0], demo.raw[3], 2);
  testRun(rc, qc, demo.raw[0], demo.raw[2], 3);
  testRun(rc, qc, demo.raw[0], demo.raw[3], 4);
  /*
  testRun(rc, qc, demo.raw[0], demo.raw[3], 2);
  testRun(rc, qc, demo.raw[0], demo.raw[1], 3); */

  setRoutes(server, rc, qc);
  return {
    express: server,
  };
}
export default setupServer();
