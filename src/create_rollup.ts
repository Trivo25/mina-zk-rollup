/* eslint-disable no-unused-vars */
import {
  DeployArgs,
  Experimental,
  Field,
  isReady,
  method,
  PrivateKey,
  Proof,
  Signature,
  SmartContract,
  state,
  State,
  Permissions,
} from 'snarkyjs';
import {
  RollupState,
  StateTransition,
} from './proof_system/state_transition.js';
import { Prover } from './proof_system/prover.js';
import { DepositStore } from './lib/data_store/DepositStore.js';
import { AccountStore } from './lib/data_store/AccountStore.js';
import { GlobalState } from './rollup_operator/services/Service.js';
import { setupService } from './rollup_operator/services/setupService.js';
import {
  RollupDeposit,
  RollupTransaction,
} from './proof_system/transaction.js';

export { zkRollup };

async function zkRollup(
  userContract: typeof SmartContract,
  feePayer: string,
  contractAddress: string
) {
  let sequencer = {
    port: 3000,
    depositHeight: 10,
    batchSize: 6,
  };
  let graphql_endpoint = 'https://proxy.berkeley.minaexplorer.com/graphql';
  let isDeployed = false;

  await isReady;

  await userContract.compile();

  let { RollupProver, ProofClass, PublicInputType } = Prover(userContract);
  let compiledProver = await RollupProver.compile();

  let RollupStateTransitionProof_ = Experimental.ZkProgram.Proof(RollupProver);
  class RollupStateTransitionProof extends RollupStateTransitionProof_ {}

  //const RollupZkapp = RollupContract(feePayer);
  let priv = PrivateKey.random();
  let pub = priv.toPublicKey();

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
      let currentState = this.currentState.get();
      this.currentState.assertEquals(currentState);

      //currentState.assertEquals(stateTransitionProof.publicInput.source);
      //this.currentState.set(stateTransitionProof.publicInput.target);

      //this.emitEvent('stateTransition', stateTransitionProof.publicInput);
    }
  }
  let compiledContract = await RollupZkApp.compile();

  let accountStore = new AccountStore();
  let depositStore = new DepositStore();

  let globalState: GlobalState = {
    accountTree: accountStore,
    transactionPool: [],
    transactionHistory: [],
    pendingDeposits: depositStore,
    state: {
      committed: new RollupState(
        Field.zero,
        Field(accountStore.getMerkleRoot()!.toString()!)
      ),
      current: new RollupState(
        Field.zero,
        Field(accountStore.getMerkleRoot()!.toString()!)
      ),
    },
  };

  setupService(globalState, RollupProver, RollupZkApp);

  return {
    start() {},
    deploy() {},
  };
}
