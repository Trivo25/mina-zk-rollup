/* 
  Client SDK to easily interact with the rollup API

*/

import * as MinaSDK from '@o1labs/client-sdk';

import {
  Signature,
  PrivateKey,
  PublicKey,
  Field,
  isReady,
  UInt64,
  UInt32,
} from 'snarkyjs';
import RollupAccount from '../lib/models/rollup/RollupAccount';
import RollupTransaction from '../lib/models/rollup/RollupTransaction';
import { toSnarkyPublicKey, toSnarkyPrivateKey } from './lib/keypair';
import { createAndSignPayment } from './lib/transfer';

await isReady;

let senderKeypair = MinaSDK.genKeys();
let receiverKeypair = MinaSDK.genKeys();

// let k = PrivateKey.random();
// console.log(k.toJSON());
// console.log(k.toPublicKey().toJSON());

let senderPub = toSnarkyPublicKey(senderKeypair.publicKey);
let senderPriv = toSnarkyPrivateKey(senderKeypair);

let receiverPub = toSnarkyPublicKey(receiverKeypair.publicKey);

// let tx: Field[] = [Field(0), Field(1)];

// let s = Signature.create(senderPriv, tx);

// console.log(s.verify(senderPub, tx).toBoolean());

let rollupTransaction = new RollupTransaction(
  UInt64.fromNumber(100),
  UInt32.fromNumber(0),
  senderPub,
  receiverPub
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
  from: 'B62qnWNMQN31Ki6Bie6yxZWTnxVp6zjuWRD9tLwQnQcLj9X3QiAsgBL',
  to: 'B62qjpWY8XLhJmqAVobAcd56pcCEJgcQAmqoufA4E1UbREf6ecBtsss',
  amount: 100,
  nonce: 0,
  publicKey: {
    g: {
      x: '10403996635208384494000576583154508739074089553813316440641262781046658512525',
      y: '28475752123784524432200374217371603321225482732108015475742377080547605049403'
    }
  },
  signature: {
    publicKey: {
      g: {
        x: '10403996635208384494000576583154508739074089553813316440641262781046658512525',
        y: '28475752123784524432200374217371603321225482732108015475742377080547605049403'
      }
    },
    signature: {
      r: '21658455864569086712744116028277239170281857425326883706580956150479968025271',
      s: '8287661432985046300118750593484672549161823095612225505989190327288948676155'
    },
    payload: [
      '100',
      '0',
      '10403996635208384494000576583154508739074089553813316440641262781046658512525',
      '28475752123784524432200374217371603321225482732108015475742377080547605049403',
      '10403996635208384494000576583154508739074089553813316440641262781046658512525',
      '28475752123784524432200374217371603321225482732108015475742377080547605049403'
    ]
  }
}

// json compatible

{
  "from": "B62qnWNMQN31Ki6Bie6yxZWTnxVp6zjuWRD9tLwQnQcLj9X3QiAsgBL",
  "to": "B62qjpWY8XLhJmqAVobAcd56pcCEJgcQAmqoufA4E1UbREf6ecBtsss",
  "amount": 100,
  "nonce": 0,
  "signature": {
    "publicKey": {
      "g": {
        "x": "10403996635208384494000576583154508739074089553813316440641262781046658512525",
        "y": "28475752123784524432200374217371603321225482732108015475742377080547605049403"
      }
    },
    "signature": {
      "r": "21658455864569086712744116028277239170281857425326883706580956150479968025271",
      "s": "8287661432985046300118750593484672549161823095612225505989190327288948676155"
    },
    "payload": [
      "100",
      "0",
      "10403996635208384494000576583154508739074089553813316440641262781046658512525",
      "28475752123784524432200374217371603321225482732108015475742377080547605049403",
      "10403996635208384494000576583154508739074089553813316440641262781046658512525",
      "28475752123784524432200374217371603321225482732108015475742377080547605049403"
    ]
  }
}



*/
