import { Field, SelfProof, Experimental } from 'snarkyjs';
import {
  RollupStateTransition,
  RollupTransaction,
  TransactionBatch,
} from './index.js';
import DepositBatch from './models/DepositBatch.js';

export const Prover = Experimental.ZkProgram({
  publicInput: RollupStateTransition,

  methods: {
    /**
     * Proves a batch of layer 2 transactions
     */
    proveTransactionBatch: {
      // eslint-disable-next-line no-undef
      privateInputs: [TransactionBatch],

      method(stateTransition: RollupStateTransition, batch: TransactionBatch) {
        // proving a batch of n tx goes as follows:
        // we check accounts against the intermediate in an inductive way to "reach" the target root
        let intermediateStateRoot = stateTransition.source.accountDbCommitment;
        batch.xs.forEach((tx: RollupTransaction) => {
          // is the sender in the state root?
          let expectedSenderRoot = tx.sender.merkleProof.calculateRoot(
            tx.sender.getHash()
          );
          expectedSenderRoot.assertEquals(intermediateStateRoot);

          // now we verify signature and account properties and apply changes
          tx.signature.verify(tx.sender.publicKey, tx.toFields()).assertTrue();
          // make sure the sender has the funds!
          tx.amount.assertLte(tx.sender.balance);
          tx.nonce.assertEquals(tx.sender.nonce);

          // apply changes to the sender account

          tx.sender.balance = tx.sender.balance.sub(tx.amount);
          tx.sender.nonce = tx.sender.nonce.add(1);

          // calculate updates to the state tree

          let tempRoot = tx.sender.merkleProof.calculateRoot(
            tx.sender.getHash()
          );

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
          tx.receiver.balance = tx.receiver.balance.add(tx.amount);

          intermediateStateRoot = tx.receiver.merkleProof.calculateRoot(
            tx.receiver.getHash()
          );
        });
        // at the end we want to match the stateTransition.traget root!
        stateTransition.target.accountDbCommitment.assertEquals(
          intermediateStateRoot
        );
      },
    },
    /**
     * Proves deposit to existing account
     */
    proveDepositToExistingAccount: {
      // eslint-disable-next-line no-undef
      privateInputs: [DepositBatch],

      method(stateTransition: RollupStateTransition, batch: DepositBatch) {
        let intermediatePendingDepositsCommitment =
          stateTransition.source.pendingDepositsCommitment;

        let intermediateAccountDbCommitment =
          stateTransition.source.accountDbCommitment;

        batch.xs.forEach((deposit) => {
          deposit.signature.verify(deposit.publicKey, deposit.toFields());

          let receiver = deposit.target;

          // deposit must be within the deposit commitment root
          let tempDepositRoot = deposit.merkleProof.calculateRoot(
            deposit.getHash()
          );
          tempDepositRoot.assertEquals(intermediatePendingDepositsCommitment);

          deposit.to.assertEquals(receiver.publicKey);

          let tempAccountRoot = receiver.merkleProof.calculateRoot(
            receiver.getHash()
          );
          tempAccountRoot.assertEquals(intermediateAccountDbCommitment);

          // we apply the new deposit and re-calculate state root
          receiver.balance = receiver.balance.add(deposit.amount);

          intermediateAccountDbCommitment = receiver.merkleProof.calculateRoot(
            receiver.getHash()
          );

          // we "free up" the leaf with a Field.zero, so it can be used for another deposit
          intermediatePendingDepositsCommitment =
            deposit.merkleProof.calculateRoot(Field.zero);
        });

        stateTransition.target.pendingDepositsCommitment.assertEquals(
          intermediatePendingDepositsCommitment
        );

        stateTransition.target.accountDbCommitment.assertEquals(
          intermediateAccountDbCommitment
        );
      },
    },
    /**
     * Proves deposit to a new account and its creation TODO: unify with proveDepositToExistingAccount
     */
    proveDepositToNewAccount: {
      // eslint-disable-next-line no-undef
      privateInputs: [DepositBatch],

      method(stateTransition: RollupStateTransition, batch: DepositBatch) {
        let intermediatePendingDepositsCommitment =
          stateTransition.source.pendingDepositsCommitment;

        let intermediateAccountDbCommitment =
          stateTransition.source.accountDbCommitment;

        batch.xs.forEach((deposit) => {
          deposit.signature.verify(deposit.publicKey, deposit.toFields());

          let receiver = deposit.target;

          // deposit must be within the deposit commitment root
          let tempDepositRoot = deposit.merkleProof.calculateRoot(
            deposit.getHash()
          );
          tempDepositRoot.assertEquals(intermediatePendingDepositsCommitment);

          deposit.to.assertEquals(receiver.publicKey);

          // making sure the account is empty and within a free slot in the state root
          receiver.isEmpty().assertTrue();
          receiver.merkleProof.calculateRoot(receiver.getHash());

          // create our new account, set the pub key and apply deposit
          receiver.publicKey = deposit.publicKey;
          receiver.balance = receiver.balance.add(deposit.amount);

          // update the state root with the newly added account
          intermediateAccountDbCommitment = receiver.merkleProof.calculateRoot(
            receiver.getHash()
          );

          // TODO: maybe do a validity check on the public key as well

          // we "free up" the leaf with a Field.zero, so it can be used for another deposit
          intermediatePendingDepositsCommitment =
            deposit.merkleProof.calculateRoot(Field.zero);
        });

        stateTransition.target.pendingDepositsCommitment.assertEquals(
          intermediatePendingDepositsCommitment
        );

        stateTransition.target.accountDbCommitment.assertEquals(
          intermediateAccountDbCommitment
        );
      },
    },
    /**
     * Recursively merges two proofs
     */
    merge: {
      privateInputs: [SelfProof, SelfProof],

      method(
        stateTransition: RollupStateTransition,
        p1: SelfProof<RollupStateTransition>,
        p2: SelfProof<RollupStateTransition>
      ) {
        p1.verify();
        p2.verify();

        // p1 source equals source
        p1.publicInput.source.accountDbCommitment.assertEquals(
          stateTransition.source.accountDbCommitment
        );
        p1.publicInput.source.pendingDepositsCommitment.assertEquals(
          stateTransition.source.pendingDepositsCommitment
        );

        // p1 source target equals p2 source
        p1.publicInput.target.accountDbCommitment.assertEquals(
          p2.publicInput.source.accountDbCommitment
        );
        p1.publicInput.target.pendingDepositsCommitment.assertEquals(
          p2.publicInput.source.pendingDepositsCommitment
        );

        // p2 source equals target
        p2.publicInput.target.accountDbCommitment.assertEquals(
          stateTransition.target.accountDbCommitment
        );
        p2.publicInput.target.pendingDepositsCommitment.assertEquals(
          stateTransition.target.pendingDepositsCommitment
        );
      },
    },
  },
});
let RollupStateTransitionProof_ = Experimental.ZkProgram.Proof(Prover);
export class RollupStateTransitionProof extends RollupStateTransitionProof_ {}
