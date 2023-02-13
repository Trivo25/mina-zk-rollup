import {
  DeployArgs,
  SmartContract,
  State,
  Permissions,
  Signature,
  Field,
  state,
  method,
  PrivateKey,
  Experimental,
} from 'snarkyjs';
import {
  RollupState,
  StateTransition,
} from '../proof_system/state_transition.js';
import {
  RollupDeposit,
  RollupTransaction,
} from '../proof_system/transaction.js';

export { RollupContract };

function RollupContract(privateKey: string, prover: any) {
  let priv = PrivateKey.fromBase58(privateKey);
  let pub = priv.toPublicKey();

  // make typing better
  let RollupProof = Experimental.ZkProgram.Proof(prover);
  class RollupStateTransitionProof extends RollupProof {}

  // this is used in order to "hard code" the verifier circuit of the prover
  class RollupZkApp extends SmartContract {
    privileged = pub;

    @state(RollupState) currentState = State<RollupState>();

    events = {
      stateTransition: StateTransition,
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

      let newState = new RollupState({
        pendingDepositsCommitment: newRoot,
        accountDbCommitment: currentState.accountDbCommitment,
      });
      this.currentState.set(newState);
    }

    @method forceWithdraw(tx: RollupTransaction) {
      let currentState = this.currentState.get();
      this.currentState.assertEquals(currentState);

      let tempRoot = tx.sender.witness.calculateRoot(tx.sender.hash());
      tempRoot.assertEquals(currentState.accountDbCommitment);

      //  ! TODO

      // apply amount diff and transition to new state
      // emit event
    }

    @method verifyBatch(
      stateTransitionProof: RollupStateTransitionProof,
      sig: Signature
    ) {
      stateTransitionProof.verify();
      let currentState = this.currentState.get();
      this.currentState.assertEquals(currentState);

      // ! TODO: make work once recursion is fixed

      //currentState.assertEquals(stateTransitionProof.publicInput.source);
      //this.currentState.set(stateTransitionProof.publicInput.target);

      //this.emitEvent('stateTransition', stateTransitionProof.publicInput);
    }
  }

  return RollupZkApp;
}
