/* 
  Client SDK to easily interact with the rollup API

*/

import Client from 'mina-signer';
import { Keypair } from 'mina-signer/dist/src/TSTypes';
import { isReady, UInt64, UInt32, PrivateKey } from 'snarkyjs';
import RollupTransaction from '../rollup_operator/rollup/models/RollupTransaction';
import { createAndSignPayment } from './lib/transaction';

await isReady;

let c = new Client({ network: 'mainnet' });
let senderKeypair = c.genKeys();
let receiverKeypair = c.genKeys();

// let k = PrivateKey.random();
// console.log(k.toJSON());
// console.log(k.toPublicKey().toJSON());

let senderPriv = PrivateKey.random();

let senderPub = senderPriv.toPublicKey();

let receiverPub = PrivateKey.random().toPublicKey();

// let tx: Field[] = [Field(0), Field(1)];

// let s = Signature.create(senderPriv, tx);

// console.log(s.verify(senderPub, tx).toBoolean());

let rollupTransaction = new RollupTransaction(
  UInt64.fromNumber(100),
  UInt32.fromNumber(0),
  senderPub!,
  receiverPub!
);

let payload = createAndSignPayment(
  rollupTransaction,
  senderKeypair.publicKey,
  receiverKeypair.publicKey,
  senderPriv
);

console.log(payload);

export {};

/*

{
  "from": "B62qjZntzoQ517nMFSNYrCpxgAdQ14ajPPWDscE9ZiMcVfLcZ1M5EFz",
  "to": "B62qkUvW3uuSgfbKhCHa61RyQPo6nS8kKi61hXPJGmrK3kyjbFY53rC",
  "amount": 100,
  "nonce": 0,
  "sender_publicKey": {
    "g": {
      "x": "15698776002173675077752384092691455924316533945842382557454957068942024607238",
      "y": "15832394724804806371817843368876305423553779677589278329414978157440470074964"
    }
  },
  "receiver_publicKey": {
    "g": {
      "x": "28562257761512858159342604097463943547481570856100593573547922082460286782982",
      "y": "6030690174561733001405183913465520967105265502589699050871909489229468937640"
    }
  },
  "signature": {
    "r": "21583031330126605534696597174982757423518252873843738268742101706938907450595",
    "s": "24348068082647005545174619154440328256516512391054482189670066514637857472889"
  },
  "payload": [
    "100",
    "0",
    "15698776002173675077752384092691455924316533945842382557454957068942024607238",
    "15832394724804806371817843368876305423553779677589278329414978157440470074964",
    "28562257761512858159342604097463943547481570856100593573547922082460286782982",
    "6030690174561733001405183913465520967105265502589699050871909489229468937640"
  ],
  "method": "simple_transfer"
}

 */
