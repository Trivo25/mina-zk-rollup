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
import { RollupAccount, RollupStateTransition } from '../proof_system';
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
import { ITransaction } from '../../lib/models';
import {} from 'crypto';
import { signTx } from '../../client_sdk';
import { Prover, RollupStateTransitionProof } from '../proof_system/prover';
import { ContractInterface } from '../blockchain';
import { RollupZkApp } from '../../zkapp/RollupZkApp';
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
  // setting up local contract
  let Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  let feePayer = Local.testAccounts[0].privateKey;

  // the zkapp account
  let zkappKey = PrivateKey.random();
  let zkappAddress = zkappKey.toPublicKey();

  let zkapp = new RollupZkApp(zkappAddress);
  console.log('compiling contract');
  try {
    await RollupZkApp.compile(zkappAddress);
  } catch (error) {
    console.log(error);
  }
  console.log('deploying contract');
  let tx = await Mina.transaction(feePayer, () => {
    Party.fundNewAccount(feePayer);
    zkapp.deploy({ zkappKey });
  });
  tx.send();
  console.log('deployed');

  return {
    async submitProof(
      stateTransition: RollupStateTransition,
      stateTransitionProof: RollupStateTransitionProof
    ) {
      let tx = await Mina.transaction(feePayer, () => {
        zkapp.verifyBatch(stateTransitionProof, stateTransition);
        zkapp.sign(zkappKey);
      });
      await tx.prove();
      tx.send();
      console.log('proof submitted');
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

  let contract = await setupLocalContract();

  console.log('Prover compiled');

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
