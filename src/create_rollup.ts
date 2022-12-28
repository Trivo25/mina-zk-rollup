/* eslint-disable no-unused-vars */
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { Field, isReady, SmartContract } from 'snarkyjs';
import { RollupState } from './proof_system/state_transition';
import QueryController from './rollup_operator/controllers/QueryController';
import RollupController from './rollup_operator/controllers/RollupController';
import GlobalEventHandler from './rollup_operator/events/gobaleventhandler';
import QueryService from './rollup_operator/services/QueryService';

import { Prover } from './proof_system/prover';
import { RollupContract } from './zkapp/rollup_contract';
import { DepositStore } from './lib/data_store/DepositStore';
import { AccountStore } from './lib/data_store/AccountStore';
import { setRoutes } from './rollup_operator/routes';
import { GlobalState } from './rollup_operator/services/Service';
import { RollupService } from './rollup_operator/services/RollupService';
import { setupService } from './rollup_operator/services/setupService';

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

  let { Prover: RollupProver, ProofClass } = await Prover(userContract);
  let compiledProver = await RollupProver.compile();

  const RollupZkapp = RollupContract<InstanceType<typeof ProofClass>>(feePayer);
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
