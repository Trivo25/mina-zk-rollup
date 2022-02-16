/* 
  Client SDK to easily interact with the rollup API

*/

import * as MinaSDK from '@o1labs/client-sdk';
import { getPaymentPayload, signRollupPayment } from './lib/Transfer';

let keys = MinaSDK.genKeys();

let payload = getPaymentPayload(
  keys.publicKey,
  MinaSDK.genKeys().publicKey,
  100,
  0,
  ''
);

let signedPayment = signRollupPayment(payload, keys);

console.log(signedPayment);

export {};
