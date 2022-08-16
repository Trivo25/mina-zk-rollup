import {
  DeployArgs,
  Field,
  method,
  SmartContract,
  state,
  State,
  Permissions,
  PublicKey,
  Signature,
} from 'snarkyjs';
import {
  RollupDeposit,
  RollupState,
  RollupStateTransition,
  RollupTransaction,
} from '../rollup_operator/proof_system';
import { RollupStateTransitionProof } from '../rollup_operator/proof_system/prover';

import Config from '../config/config';

export class RollupZkApp extends SmartContract {
  @state(RollupState) currentState = State<RollupState>();

  @state(RollupState) rollupOperatorKey = State<PublicKey>();

  events = {
    stateTransition: RollupStateTransition,
    deposit: RollupDeposit,
    forceWithdraw: RollupTransaction,
  };

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
      send: Permissions.proofOrSignature(),
    });
    this.currentState.set(
      new RollupState(
        Field.zero,
        Field.fromString(
          '19584779366779968710219558176224754481763634630472304415471586047809164902895'
        )
      )
    );
  }

  @method deposit(deposit: RollupDeposit) {
    deposit.signature.verify(deposit.publicKey, deposit.toFields());

    let currentState = this.currentState.get();
    this.currentState.assertEquals(currentState);

    // slot must be empty before we can process deposits

    deposit.merkleProof
      .calculateRoot(Field.zero)
      .assertEquals(currentState.pendingDepositsCommitment);

    let newRoot = deposit.merkleProof.calculateRoot(deposit.getHash());
    let index = deposit.merkleProof.calculateIndex();

    deposit.leafIndex.assertEquals(index);

    this.balance.addInPlace(deposit.amount);
    this.emitEvent('deposit', deposit);

    let newState = new RollupState(newRoot, currentState.accountDbCommitment);
    this.currentState.set(newState);
  }

  @method forceWithdraw(tx: RollupTransaction) {
    let currentState = this.currentState.get();
    this.currentState.assertEquals(currentState);

    let tempRoot = tx.sender.merkleProof.calculateRoot(tx.sender.getHash());
    tempRoot.assertEquals(currentState.accountDbCommitment);

    // .. !TODO

    // apply amount diff and transition to new state
    // emit event
  }

  @method verifyBatch(
    stateTransitionProof: RollupStateTransitionProof,
    sig: Signature
  ) {
    stateTransitionProof.verify();

    let rollupOperatorKey = this.rollupOperatorKey.get();
    this.rollupOperatorKey.assertEquals(rollupOperatorKey);

    sig.verify(rollupOperatorKey, stateTransitionProof.publicInput.toFields());

    let currentState = this.currentState.get();
    this.currentState.assertEquals(currentState);

    currentState.assertEquals(stateTransitionProof.publicInput.source);
    this.currentState.set(stateTransitionProof.publicInput.target);

    this.emitEvent('stateTransition', stateTransitionProof.publicInput.source);
  }
}
