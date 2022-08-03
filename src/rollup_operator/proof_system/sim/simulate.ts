import { Circuit, Field, Poseidon } from 'snarkyjs';
import { KeyedDataStore } from '../../../lib/data_store';
import { MerkleProof } from '../../../lib/merkle_proof';
import RollupAccount from '../models/RollupAccount';
import RollupState from '../models/RollupState';
import RollupStateTransition from '../models/RollupStateTransition';
import RollupTransaction from '../models/RollupTransaction';
import TransactionBatch from '../models/TransactionBatch';

export const simulateTransition = (
  batch: TransactionBatch,
  store: KeyedDataStore<string, RollupAccount>
) => {
  let txs: RollupTransaction[] = [];
  let rootBefore = store.getMerkleRoot()!;
  console.log('sim: root before ', rootBefore.toString());
  batch.xs.forEach((tx: RollupTransaction, i: number) => {
    let sender = store.get(tx.sender!.getAddress())!.clone();
    let receiver = store.get(tx.receiver!.getAddress())!.clone();
    sender.merkleProof = store.getProofByKey(sender.getAddress());

    sender.balance = sender.balance.sub(tx.amount);
    sender.nonce = sender.nonce.add(1);

    // calculate updates to the state tree

    store.set(tx.sender!.getAddress(), sender);

    // move over to the receiver
    receiver.merkleProof = store.getProofByKey(receiver.getAddress());

    // apply change to the receiver
    receiver.balance = receiver.balance.add(tx.amount);

    store.set(receiver.getAddress(), receiver);

    tx.sender = sender;
    tx.receiver = receiver;

    txs.push(
      RollupTransaction.from(
        tx.amount,
        tx.nonce,
        sender.publicKey,
        receiver.publicKey,
        tx.tokenId,
        tx.signature
      )
    );
  });

  let rootAfter = store.getMerkleRoot()!;
  console.log('sim: root after ', rootAfter.toString());

  return {
    transactions: TransactionBatch.fromElements(txs),
    transition: new RollupStateTransition(
      new RollupState(Field.zero, rootBefore),
      new RollupState(Field.zero, rootAfter)
    ),
  };
};

export const calculateMerkleRoot = (
  targetHash: Field,
  merkleProof: MerkleProof
): Field => {
  let proofHash: Field = targetHash;
  for (let x = 0; x < 2; x++) {
    proofHash = Circuit.if(
      merkleProof.xs[x].direction.equals(Field(0)),
      Poseidon.hash([merkleProof.xs[x].hash, proofHash]),
      proofHash
    );
    proofHash = Circuit.if(
      merkleProof.xs[x].direction.equals(Field(1)),
      Poseidon.hash([proofHash, merkleProof.xs[x].hash]),
      proofHash
    );
  }

  return proofHash;
};
