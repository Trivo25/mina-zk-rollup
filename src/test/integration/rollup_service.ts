import { isReady, Field, PrivateKey, UInt32, UInt64 } from 'snarkyjs';
import { signTx } from '../../client_sdk';
import { AccountStore, DepositStore } from '../../lib/data_store';
import { AccountMerkleProof } from '../../lib/merkle_proof';
import { ITransaction } from '../../lib/models';
import { setupContract } from '../../rollup_operator/contract';
import { DataStore } from '../../rollup_operator/data_store';
import { GlobalEventHandler } from '../../rollup_operator/events';
import { RollupAccount, RollupState } from '../../proof_system';
import { Prover } from '../../proof_system/prover';
import RollupService from '../../rollup_operator/services/RollupService';

await isReady;

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
let demo = await setupDemoStore();

let globalStore: DataStore = {
  accountTree: demo.store,
  transactionPool: [],
  transactionHistory: [],
  pendingDeposits: demo.depositStore,
  state: {
    committed: new RollupState(
      Field.zero,
      Field(demo.store.getMerkleRoot()!.toString()!)
    ),
    current: new RollupState(
      Field.zero,
      Field(demo.store.getMerkleRoot()!.toString()!)
    ),
  },
};

function testRun(rs: RollupService, from: any, to: any, nonce: number) {
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
  rs.processTransaction(tx);
}

async function setupDemoStore() {
  let store = new AccountStore();

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
}

await Prover.compile();

let contract = await setupContract();

let rollupService = new RollupService(
  globalStore,
  GlobalEventHandler,
  Prover,
  contract
);

setTimeout(() => {
  testRun(rollupService, raw[0], raw[1], 0);
  testRun(rollupService, raw[0], raw[2], 1);
}, 500);
