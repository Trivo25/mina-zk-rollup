import RollupStateTransition from '../models/RollupStateTransition';
import RollupTransaction from '../models/RollupTransaction';
import TransactionBatch from '../models/TransactionBatch';
import { calculateMerkleRoot } from './simulate';

export const proverTest = (
  stateTransition: RollupStateTransition,
  batch: RollupTransaction[]
) => {
  // proving a batch of n tx goes as follows:
  // we check accounts against the intermediate in an inductive way to "reach" the target root
  let intermediateStateRoot = stateTransition.source.accountDbCommitment;

  batch.forEach((tx: RollupTransaction, i: number) => {
    // is the sender in the state root?
    let expectedSenderRoot = calculateMerkleRoot(
      tx.sender!.getHash(),
      tx.sender!.merkleProof
    );

    expectedSenderRoot.assertEquals(intermediateStateRoot);

    tx.signature.verify(tx.sender!.publicKey, tx.toFields()).assertTrue();
    // make sure the sender has the funds!
    tx.amount.assertLte(tx.sender!.balance);
    tx.nonce.assertEquals(tx.sender!.nonce);

    // apply changes to the sender account

    tx.sender!.balance = tx.sender!.balance.sub(tx.amount);
    tx.sender!.nonce = tx.sender!.nonce.add(1);

    // calculate updates to the state tree

    let tempRoot = calculateMerkleRoot(
      tx.sender!.getHash(),
      tx.sender!.merkleProof
    );

    // move over to the receiver

    let expectedReceiverRoot = calculateMerkleRoot(
      tx.receiver!.getHash(),
      tx.receiver!.merkleProof
    );

    //doing some induction stuff:
    //if sender's merkle path is valid and matches the original state root
    //then the receiver merkle path has to be in the update state root
    // that we get from the sender after applying the changes to the sender

    expectedReceiverRoot.assertEquals(tempRoot);

    // apply change to the receiver
    tx.receiver!.balance = tx.receiver!.balance.add(tx.amount);

    intermediateStateRoot = calculateMerkleRoot(
      tx.receiver!.getHash(),
      tx.receiver!.merkleProof
    );
  });

  // at the end we want to match the stateTransition.traget root!

  stateTransition.target.accountDbCommitment.assertEquals(
    intermediateStateRoot
  );
};
