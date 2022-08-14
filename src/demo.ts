import { isReady, shutdown } from 'snarkyjs';
import { AccountStore } from './lib/data_store';
import { RollupAccount } from './rollup_operator/proof_system';
const init = async () => {
  await isReady;
  console.log('1');
  let store = new AccountStore();
  console.log('2');

  console.log(store.getMerkleRoot().toString());

  store.set(1n, RollupAccount.empty());

  console.log(store.getMerkleRoot().toString());

  let p = store.getProof(1n);

  console.log(p.calculateRoot(RollupAccount.empty().getHash()).toString());

  await shutdown();
};

init();

export {};
