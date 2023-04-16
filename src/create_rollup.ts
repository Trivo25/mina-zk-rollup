/* eslint-disable no-unused-vars */
import { Field, isReady, SmartContract } from 'snarkyjs';
import { NetworkState, RollupState } from './proof_system/state_transition.js';
import { Prover } from './proof_system/prover.js';
import { DepositStore } from './lib/data_store/DepositStore.js';
import { AccountStore } from './lib/data_store/AccountStore.js';
import { GlobalState } from './rollup_operator/services/Service.js';
import { setupService } from './rollup_operator/services/setupService.js';
import { Transaction } from './proof_system/transaction.js';
import { RollupContract } from './zkapp/rollup_contract.js';
import { logger } from './proof_aggregator/src/index.js';

export { zkRollup };

/**
 * This function allows one to spin-up an app-specific rollup that runs the provided smart contract.
 * @param userContract Smart contract to run on the app-specific rollup.
 * @param feePayer Fee payer that pays the transaction fees.
 * @param contractAddress Target address to deploy the contract to.
 * @returns A rollup!
 */
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
  let network_endpoint = 'https://proxy.berkeley.minaexplorer.com/graphql';
  let isDeployed = false;

  await isReady;

  await userContract.compile();

  console.log(1);
  let { RollupProver, ProofClass, PublicInputType } = Prover(userContract);
  let compiledProver = await RollupProver.compile();
  console.log(2);
  const RollupZkapp = RollupContract(feePayer, RollupProver);
  console.log(3);
  let compiledContract = await RollupZkapp.compile();
  console.log(4);
  let accountStore = new AccountStore();
  let depositStore = new DepositStore();

  let transactionPool: Transaction[] = [];
  let transactionHistory: Transaction[] = [];

  let accountRoot = accountStore.getMerkleRoot()!;
  let depositRoot = depositStore.getMerkleRoot()!;
  // this is also just temporary
  let globalState: GlobalState = {
    accountTree: accountStore,
    transactionPool,
    transactionHistory,
    pendingDeposits: depositStore,
    state: {
      // represents the actual on-chain state
      committed: new RollupState({
        accountDbCommitment: accountRoot,
        pendingDepositsCommitment: depositRoot,
        network: NetworkState.empty(),
      }),
      // represents the current rollup state
      current: new RollupState({
        accountDbCommitment: accountRoot,
        pendingDepositsCommitment: depositRoot,
        network: NetworkState.empty(),
      }),
    },
  };

  let rollup = setupService(globalState, RollupProver, RollupZkapp);

  return {
    async start(port: number) {
      await rollup.start(port);
      logger.log(`Graphql server running on http://localhost:${port}/graphql`);
      console.error('Not further implemented');
      return new Promise(() => {});
    },
    async deploy() {
      throw Error('Not implemented');
    },
    rs: rollup.rs,
  };
}
