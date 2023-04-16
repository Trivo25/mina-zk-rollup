import { PrivateKey, SmartContract, Field, method, isReady } from 'snarkyjs';
import { zkRollup } from '../../create_rollup';

await isReady;

class MyContract extends SmartContract {
  @method update(x: Field) {
    x.assertEquals(1);
  }
}

await MyContract.compile();

let feePayerKey = PrivateKey.random();
let contractKey = PrivateKey.random();

const Sequencer = await zkRollup(
  MyContract,
  feePayerKey.toBase58(),
  contractKey.toBase58()
);
