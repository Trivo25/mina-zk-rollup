import {
  Field,
  isReady,
  method,
  Poseidon,
  PrivateKey,
  SmartContract,
} from 'snarkyjs';
import { zkRollup } from './create_rollup.js';

await isReady;

class MyContract extends SmartContract {
  @method update(x: Field) {
    x.add(2).add(5).sub(2);
    Poseidon.hash([Field.zero]).equals(Poseidon.hash([Field.zero]));
    Poseidon.hash([Field.zero]).assertEquals(Poseidon.hash([Field.zero]));
  }
}

let feePayer = PrivateKey.random().toBase58();
let contractAddress = PrivateKey.random().toBase58();

const Rollup = await zkRollup(MyContract, feePayer, contractAddress);
await Rollup.start(4000);
