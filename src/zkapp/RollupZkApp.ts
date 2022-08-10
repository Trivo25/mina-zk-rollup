import {
  DeployArgs,
  Field,
  method,
  SmartContract,
  state,
  State,
  UInt64,
  Permissions,
  Proof,
  Circuit,
} from 'snarkyjs';
import {
  RollupAccount,
  RollupDeposit,
  RollupState,
  RollupStateTransition,
} from '../rollup_operator/proof_system';
import { RollupStateTransitionProof } from '../rollup_operator/proof_system/prover';

export class RollupZkApp extends SmartContract {
  @state(RollupState) currentState = State<RollupState>();

  events = {
    stateTransition: RollupStateTransition,
    deposit: RollupDeposit,
  };

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
      send: Permissions.proofOrSignature(),
    });
    this.balance.addInPlace(UInt64.fromNumber(0));
    this.currentState.set(new RollupState(Field.zero, Field.zero));
  }

  @method deposit(deposit: RollupDeposit) {
    deposit.signature.verify(deposit.publicKey, deposit.toFields());
    this.emitEvent('deposit', deposit);
  }

  @method withdraw(account: RollupAccount, amount: UInt64) {
    // TODO: verify state inclusion
    // apply amount diff and transition to new state
    // emit event
  }

  @method verifyBatch(
    stateTransitionProof: RollupStateTransitionProof,
    stateTransition: RollupStateTransition
  ) {
    stateTransition.assertEquals(stateTransitionProof.publicInput);
    stateTransitionProof.verify();

    this.emitEvent('stateTransition', stateTransition);
  }
}
