import {
  DeployArgs,
  Field,
  method,
  SmartContract,
  state,
  State,
  UInt64,
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
import { calculateMerkleRoot } from '../rollup_operator/proof_system/sim/simulate';

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
    this.balance.addInPlace(UInt64.fromNumber(0));
    this.currentState.set(new RollupState(Field.zero, Field.zero));
  }

  @method deposit(deposit: RollupDeposit, deposits: Deposits) {
    deposit.signature.verify(deposit.publicKey, deposit.toFields());

    let depositCommitment = this.currentState.get().accountDbCommitment;
    this.currentState.get().accountDbCommitment.assertEquals(depositCommitment);

    deposits.getHash().assertEquals(depositCommitment);

    this.emitEvent('deposit', deposit);
    this.balance.addInPlace(deposit.amount);
  }

  @method forceWithdraw(tx: RollupTransaction) {
    let currentState = this.currentState.get();
    this.currentState.assertEquals(currentState);

    let tempRoot = calculateMerkleRoot(
      tx.sender.getHash(),
      tx.sender.merkleProof
    );
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

    this.emitEvent('stateTransition', stateTransition);
  }
}
