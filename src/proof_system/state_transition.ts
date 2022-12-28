import { CircuitValue, prop, Field, Poseidon } from 'snarkyjs';
import { AccountStore } from '../lib/data_store/AccountStore.js';
import { Account } from './account.js';
import { RollupTransaction } from './transaction.js';
export {
  applyTransitionSimulation,
  verifyTransaction,
  proverTest,
  StateTransition,
  RollupState,
};

const applyTransitionSimulation = (
  tx: RollupTransaction,
  store: AccountStore
): RollupTransaction => {
  let senderIndex = store.keyByPublicKey(tx.from)!;
  let receiverIndex = store.keyByPublicKey(tx.to)!;

  let sender = store.get(senderIndex)!.clone();
  let receiver = store.get(receiverIndex)!.clone();

  tx.from.equals(tx.to).not();

  tx.from.assertEquals(sender.publicKey);
  tx.signature.verify(sender.publicKey, tx.toFields()).assertTrue();

  tx.amount.assertLte(sender.balance);
  tx.nonce.assertEquals(sender.nonce);

  tx.sender = sender.clone();
  tx.receiver = receiver.clone();

  tx.sender.merkleProof = store.getProof(senderIndex);

  sender.balance = sender.balance.sub(tx.amount);
  sender.nonce = sender.nonce.add(1);
  // calculate updates to the state tree

  store.set(senderIndex, sender);

  // move over to the receiver
  tx.receiver.merkleProof = store.getProof(receiverIndex);

  // apply change to the receiver
  receiver.balance = receiver.balance.add(tx.amount);

  store.set(receiverIndex, receiver);

  return tx;
};

const verifyTransaction = (
  tx: RollupTransaction,
  sender: Account,
  receiver: Account
) => {
  try {
    sender.publicKey.assertEquals(tx.from);

    receiver.publicKey.assertEquals(tx.to);

    let isValidSig = tx.signature.verify(tx.from, tx.toFields());
    console.log('is valid sig', isValidSig.toString());
    isValidSig.assertTrue();
    /*     tx.amount.assertLte(sender.balance);
    tx.nonce.assertEquals(sender.nonce); */
  } catch (error) {
    throw new Error('Cannot verify transaction, transaction invalid.');
  }
};

const proverTest = (
  stateTransition: StateTransition,
  batch: RollupTransaction[]
) => {
  // proving a batch of n tx goes as follows:
  // we check accounts against the intermediate in an inductive way to "reach" the target root
  let intermediateStateRoot = stateTransition.source.accountDbCommitment;

  batch.forEach((tx: RollupTransaction, i: number) => {
    // is the sender in the state root?
    let expectedSenderRoot = tx.sender.merkleProof.calculateRoot(
      tx.sender.getHash()
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

    let tempRoot = tx.sender.merkleProof.calculateRoot(tx.sender.getHash());

    // move over to the receiver

    let expectedReceiverRoot = tx.receiver.merkleProof.calculateRoot(
      tx.receiver.getHash()
    );

    //doing some induction stuff:
    //if sender's merkle path is valid and matches the original state root
    //then the receiver merkle path has to be in the update state root
    // that we get from the sender after applying the changes to the sender

    expectedReceiverRoot.assertEquals(tempRoot);

    // apply change to the receiver
    tx.receiver!.balance = tx.receiver!.balance.add(tx.amount);

    intermediateStateRoot = tx.receiver.merkleProof.calculateRoot(
      tx.receiver.getHash()
    );
  });

  // at the end we want to match the stateTransition.traget root!

  stateTransition.target.accountDbCommitment.assertEquals(
    intermediateStateRoot
  );
};
class RollupState extends CircuitValue {
  @prop pendingDepositsCommitment: Field;
  @prop accountDbCommitment: Field;
  constructor(pendingDepositsCommitment: Field, accountDbCommitment: Field) {
    super(pendingDepositsCommitment, accountDbCommitment);
    this.pendingDepositsCommitment = pendingDepositsCommitment;
    this.accountDbCommitment = accountDbCommitment;
  }
  getHash(): Field {
    return Poseidon.hash(this.toFields());
  }
}
/**
 * A {@link RollupStateTransition} descibes the transition that takes place when
 * the rollup operator updates the current state of the the layer 2 by providing a series of
 * proofs that attest correct execution of transactions.
 */
class StateTransition extends CircuitValue {
  @prop source: RollupState;
  @prop target: RollupState;
  constructor(source: RollupState, target: RollupState) {
    super(source, target);
    this.source = source;
    this.target = target;
  }

  getHash(): Field {
    return Poseidon.hash(this.toFields());
  }
}
