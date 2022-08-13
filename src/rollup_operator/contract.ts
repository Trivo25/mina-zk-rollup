import { Mina, PrivateKey } from 'snarkyjs';
import { RollupZkApp } from '../zkapp/RollupZkApp';
import { RollupStateTransition } from './proof_system';
import { RollupStateTransitionProof } from './proof_system/prover';
import Config from '../config/config';
import logger from '../lib/log';
export interface Contract {
  submitProof: (
    stateTransition: RollupStateTransition,
    stateTransitionProof: RollupStateTransitionProof
  ) => void;
}
export const setupContract = async (): Promise<Contract> => {
  let feePayer = PrivateKey.fromBase58(Config.accounts.feePayer.privateKey);
  let zkappKey = PrivateKey.fromBase58(Config.accounts.zkApp.privateKey);

  let Instance;
  await RollupZkApp.compile(zkappKey.toPublicKey());
  let zkapp = new RollupZkApp(zkappKey.toPublicKey());
  if (Config.graphql.remote) {
    Instance = Mina.BerkeleyQANet(Config.graphql.endpoint);
  } else {
    // setting up local contract
    Instance = Mina.LocalBlockchain();
  }
  Mina.setActiveInstance(Instance);

  return {
    async submitProof(
      stateTransition: RollupStateTransition,
      stateTransitionProof: RollupStateTransitionProof
    ) {
      let tx = await Mina.transaction(
        { feePayerKey: feePayer, fee: 100_000_000 },
        () => {
          zkapp.verifyBatch(stateTransitionProof, stateTransition);
          zkapp.sign(zkappKey);
        }
      );
      await tx.prove();

      await tx.send().wait();
      logger.info('Proof submitted');
    },
  };
};
