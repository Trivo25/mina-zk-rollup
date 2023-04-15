export { zkRollup } from './create_rollup.js';

/*

Example usage

class MyContract extends SmartContract {
  @method update(x: Field) {
    x.assertEquals(1);
  }
}

const MyRollup = await zkRollup(
  MyContract,
  PrivateKey.random().toBase59(),
  PrivateKey.random().toBase59()
);

MyRollup.start()

*/
