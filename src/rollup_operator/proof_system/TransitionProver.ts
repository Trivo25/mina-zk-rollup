import {
  Field,
  isReady,
  PrivateKey,
  shutdown,
  Signature,
  UInt32,
  UInt64,
  ZkProgram,
} from 'snarkyjs';
import {
  RollupAccount,
  RollupStateTransition,
  RollupTransaction,
  TransactionBatch,
} from './';

import { MerkleProof } from '../../lib/merkle_proof';
import { KeyedDataStore } from '../../lib/data_store';
import { calculateMerkleRoot, simulateTransition } from './sim/simulate';
import { proverTest } from './sim/proverTest';

let Prover = ZkProgram({
  publicInput: RollupStateTransition,

  methods: {
    proveTransaction: {
      // eslint-disable-next-line no-undef
      privateInputs: [TransactionBatch],

      method(stateTransition: RollupStateTransition, batch: TransactionBatch) {
        let stateRoot = stateTransition.source.accountDbCommitment;
        batch.xs.forEach((tx) => {
          tx.signature.verify(tx.sender.publicKey, tx.toFields());
          // sender is in state root
          calculateMerkleRoot(
            tx.sender.getHash(),
            tx.sender.merkleProof
          ).assertEquals(stateRoot);

          tx.amount.assertLte(tx.sender.balance);

          tx.sender.balance = tx.sender.balance.sub(tx.amount);
          /*           tx.sender.nonce.assertEquals(tx.nonce);
          tx.sender.nonce = tx.sender.nonce.add(1);
 */
          let tempRoot = calculateMerkleRoot(
            tx.sender.getHash(),
            tx.sender.merkleProof
          );
          // temp root is now our up to date state root
          // we verify that sender is also within our now updated state root,
          // which has previously been constrained to the original state root!
          calculateMerkleRoot(
            tx.receiver.getHash(),
            tx.receiver.merkleProof
          ).assertEquals(tempRoot);
          // verifying the receiver like that makes sure its a valid entry

          tx.receiver.balance = tx.receiver.balance.add(tx.amount);

          let newRoot = calculateMerkleRoot(
            tx.receiver.getHash(),
            tx.receiver.merkleProof
          );
          stateRoot = newRoot; //newRoot.assertEquals(stateTransition.target.accountDbCommitment);
        });
        stateRoot.assertEquals(stateTransition.target.accountDbCommitment);
      },
    },
  },
});

await isReady;

let accounts = new Map<string, RollupAccount>();
let addresses = [];
for (let i = 0; i < 8; i++) {
  let privateKey = PrivateKey.random();
  let acc = new RollupAccount(
    UInt64.fromNumber(1000000),
    UInt32.fromNumber(0),
    privateKey.toPublicKey(),
    MerkleProof.fromElements([])
  );
  addresses[i] = {
    addr: acc.getAddress(),
    privateKey,
  };
  accounts.set(acc.getAddress(), acc);
}

let store = new KeyedDataStore<string, RollupAccount>();
store.fromData(accounts);

const dummySignature = () => {
  return Signature.create(PrivateKey.random(), [Field.zero]);
};

let txs = [];

for (let i = 0; i < 1; i++) {
  let sender = store.get(addresses[0].addr)!.clone();
  sender.nonce = UInt32.fromNumber(i);
  let tx = new RollupTransaction(
    UInt64.fromNumber(10),
    UInt32.fromNumber(i),
    sender,
    store.get(addresses[1].addr)!,
    Field.zero,
    dummySignature()
  );

  tx.signature = Signature.create(addresses[0].privateKey, tx.toFields());
  txs.push(tx);
}

let batch = TransactionBatch.fromElements(txs);

let stateTransition = simulateTransition(batch, store);

/* let temp = calculateMerkleRoot(
  txs[0].sender.getHash(),
  txs[0].sender.merkleProof
);
console.log(
  temp.equals(stateTransition.source.accountDbCommitment).toBoolean()
);

console.log(
  calculateMerkleRoot(txs[0].receiver.getHash(), txs[0].receiver.merkleProof)
    .equals(temp)
    .toBoolean()
); */
proverTest(stateTransition, batch);
shutdown();
