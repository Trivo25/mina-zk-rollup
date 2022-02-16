import 'dotenv/config';
import { isReady, PrivateKey, shutdown, UInt32, UInt64 } from 'snarkyjs';
import Account from '../lib/models/Account';
/* import Connection from './setup/Connection'; */

import DataStore from './setup/AccountDataStore';

import server from './setup/server.js';

const PORT = process.env.PORT || 5000;

await isReady;

let instance = DataStore.getInstance();

instance.set(
  'A',
  new Account(
    UInt64.fromNumber(100),
    PrivateKey.random().toPublicKey(),
    UInt32.fromNumber(0)
  )
);
console.log(instance.getMerkleRoot());
console.log(DataStore.getInstance().getMerkleRoot());

shutdown();
/*
init();
async function init() {
  server.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
  });
}
 */
