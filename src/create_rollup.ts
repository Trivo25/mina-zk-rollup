/* eslint-disable no-unused-vars */
import {
  DeployArgs,
  Experimental,
  Field,
  isReady,
  method,
  PrivateKey,
  Signature,
  SmartContract,
  state,
  State,
  Permissions,
  Proof,
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
import { RollupContract } from './zkapp/rollup_contract.js';

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

  const RollupZkapp = RollupContract(feePayer, RollupProver);

  let priv = PrivateKey.random();
  let pub = priv.toPublicKey();

  let compiledContract = await RollupZkapp.compile();

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

  setupService(globalState, RollupProver, RollupZkapp);

  return {
    start() {},
    deploy() {},
  };
}
