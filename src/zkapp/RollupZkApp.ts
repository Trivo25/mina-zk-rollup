import {
  DeployArgs,
  Field,
  method,
  SmartContract,
  state,
  State,
  Permissions,
} from 'snarkyjs';
import {
  RollupDeposit,
  RollupState,
  RollupStateTransition,
  RollupTransaction,
} from '../rollup_operator/proof_system';
import Deposits from '../rollup_operator/proof_system/models/Deposits';
import { RollupStateTransitionProof } from '../rollup_operator/proof_system/prover';

export class RollupZkApp extends SmartContract {
  @state(RollupState) currentState = State<RollupState>();

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

  @method deposit(deposit: RollupDeposit, deposits: Deposits) {
    deposit.signature.verify(deposit.publicKey, deposit.toFields());

    let currentState = this.currentState.get();
    this.currentState.assertEquals(currentState);

    deposits.getHash().assertEquals(currentState.accountDbCommitment);

    this.emitEvent('deposit', deposit);
    this.balance.addInPlace(deposit.amount);
  }

  @method forceWithdraw(tx: RollupTransaction) {
    let currentState = this.currentState.get();
    this.currentState.assertEquals(currentState);

    let tempRoot = tx.sender.merkleProof.calculateRoot(tx.sender.getHash());
    tempRoot.assertEquals(currentState.accountDbCommitment);

    // ..

    // apply amount diff and transition to new state
    // emit event
  }

  @method verifyBatch(
    stateTransitionProof: RollupStateTransitionProof,
    stateTransition: RollupStateTransition
  ) {
    stateTransition.assertEquals(stateTransitionProof.publicInput);
    stateTransitionProof.verify();

    let currentState = this.currentState.get();
    this.currentState.assertEquals(currentState);

    this.currentState.assertEquals(stateTransitionProof.publicInput.source);
    this.currentState.set(stateTransitionProof.publicInput.target);

    this.emitEvent('stateTransition', stateTransition);
  }
}
