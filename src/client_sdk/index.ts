/* 
  Client SDK to easily interact with the rollup API

*/

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
export {};
