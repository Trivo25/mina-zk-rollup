import { Mina, PrivateKey, Signature } from 'snarkyjs';
import { RollupZkApp } from '../zkapp/RollupZkApp';
import { RollupStateTransitionProof } from '../proof_system/prover';
import Config from '../config/config';
import logger from '../lib/log';
export interface Contract {
  submitStateTransition: (
    stateTransitionProof: RollupStateTransitionProof
  ) => void;
}
export const setupContract = async (): Promise<Contract> => {
  let feePayer = PrivateKey.fromBase58(Config.accounts.feePayer.privateKey);
  let zkappKey = PrivateKey.fromBase58(Config.accounts.zkApp.privateKey);

  let zkapp = new RollupZkApp(zkappKey.toPublicKey());

  let Instance;
  try {
    await RollupZkApp.compile();
  } catch (error) {
    logger.error(error);
  }

  if (Config.remote) {
    Instance = Mina.BerkeleyQANet(Config.graphql.endpoint);
  } else {
    // setting up local contract
    Instance = Mina.LocalBlockchain();
  }
  Mina.setActiveInstance(Instance);

  return {
    async submitStateTransition(
      stateTransitionProof: RollupStateTransitionProof
    ) {
      let sig: Signature = Signature.create(
        feePayer,
        stateTransitionProof.publicInput.toFields()
      );
      let tx = await Mina.transaction(
        { feePayerKey: feePayer, fee: 100_000_000 },
        () => {
          zkapp.verifyBatch(stateTransitionProof, sig);
          zkapp.sign(zkappKey);
        }
      );
      await tx.prove();

      await tx.send();
      logger.info('Proof submitted');
    },
  };
};
