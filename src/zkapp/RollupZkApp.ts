import {
  DeployArgs,
  Field,
  method,
  SmartContract,
  state,
  State,
  Permissions,
} from 'snarkyjs';
import { DepositMerkleProof } from '../lib/merkle_proof';
import {
  RollupDeposit,
  RollupState,
  RollupStateTransition,
  RollupTransaction,
} from '../rollup_operator/proof_system';
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

  @method deposit(deposit: RollupDeposit, merklePath: DepositMerkleProof) {
    deposit.signature.verify(deposit.publicKey, deposit.toFields());

    let currentState = this.currentState.get();
    this.currentState.assertEquals(currentState);

    merklePath.calculateRoot(Field.zero); // slot must be empty before we can process deposits

    let newRoot = merklePath.calculateRoot(deposit.getHash());
    let index = merklePath.calculateIndex();

    deposit.leafIndex.assertEquals(index);

    this.balance.addInPlace(deposit.amount);
    this.emitEvent('deposit', deposit);

    currentState.pendingDepositsCommitment = newRoot;
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
