import { CircuitValue, isReady, prop, shutdown, UInt32 } from 'snarkyjs';
import MerkleStore from './rollup_operator/data_store/MerkleTreeStoretore';

class Test extends CircuitValue {
  @prop balance: UInt32;
  constructor() {
    super();
    this.balance = UInt32.fromNumber(3900);
  }
}

const init = async () => {
  await isReady;
  let set = new Map<string, Test>();
  set.set('a', new Test());
  let a = new MerkleStore('./m', 'd', set);
  console.log(await a.countLevels());
  shutdown();
};

init();
