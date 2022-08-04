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
} from 'snarkyjs';
import {
  RollupState,
  RollupStateTransition,
} from '../rollup_operator/proof_system';
import { RollupStateTransitionProof } from '../rollup_operator/proof_system/prover';

export class RollupZkApp extends SmartContract {
  @state(RollupState) currentState = State<RollupState>();

  events = {
    stateTransition: RollupStateTransition,
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

  @method verifyBatch(
    //stateTransitionProof: RollupStateTransitionProof,
    stateTransition: RollupStateTransition
  ) {
    //stateTransitionProof.verify();

    this.emitEvent('stateTransition', stateTransition);
  }
}
