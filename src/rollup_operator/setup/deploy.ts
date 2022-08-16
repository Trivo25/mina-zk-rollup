import { isReady, Mina, Party, PrivateKey, shutdown } from 'snarkyjs';

import Config from '../../config/config';
import { RollupZkApp } from '../../zkapp/RollupZkApp';
import { Prover } from '../proof_system/prover';

export const deploy = async () => {
  try {
    let Instance = Mina.BerkeleyQANet(Config.graphql.endpoint);
    Mina.setActiveInstance(Instance);

    let feePayer = PrivateKey.fromBase58(Config.accounts.feePayer.privateKey);

    // the zkapp account
    let zkappKey = PrivateKey.random();
    let zkappAddress = zkappKey.toPublicKey();

    // compiling prover dependency
    await Prover.compile();

    console.log('compiling contract');
    let { verificationKey } = await RollupZkApp.compile(zkappAddress);
    let zkapp = new RollupZkApp(zkappAddress);

    console.log('deploying contract');
    let tx = await Mina.transaction(
      { feePayerKey: feePayer, fee: 100_000_000 },
      () => {
        Party.fundNewAccount(feePayer);
        zkapp.deploy({ zkappKey, verificationKey });
        zkapp.rollupOperatorKey.set(feePayer.toPublicKey());
      }
    );
    let res = await tx.send().wait();
    console.log('deployed to ', zkappAddress.toBase58());
    console.log('priv ', zkappKey.toBase58());

    console.log(JSON.stringify(res));
  } catch (error) {
    console.log(error);
  }
};

export const isDeployed = async (address: string) => {
  return Config.accounts.zkApp.isDeployed;
};

const init = async () => {
  await isReady;
  await deploy();
  shutdown();
};
init();
