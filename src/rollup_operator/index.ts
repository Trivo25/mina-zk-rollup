import 'dotenv/config';

import Connection from './config/database.js';
import server from './config/server.js';
import ITransaction from './models/ITransaction.js';

const PORT = process.env.PORT || 5000;

init();

import * as MinaSDK from '@o1labs/client-sdk';

let keys = MinaSDK.genKeys();

let tx: ITransaction = {
  from: keys.publicKey,
  to: MinaSDK.genKeys().publicKey,
  amount: 100,
  nonce: 0,
  memo: 'some memo',
};
let signed = MinaSDK.signMessage(JSON.stringify(tx), keys);

console.log(keys.publicKey);
console.log(signed);
console.log('payload');
// need to escape " with \" because otherwise sign would be broken
let escaped = JSON.stringify(tx).replace(/"/g, '\\"');
console.log(escaped);

async function init() {
  server.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
  });
}
