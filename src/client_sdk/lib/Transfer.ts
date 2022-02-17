import * as MinaSDK from '@o1labs/client-sdk';
import { PrivateKey, Signature } from 'snarkyjs';

import ITransaction from '../../lib/models/interfaces/ITransaction';
import ISignature from '../../lib/models/interfaces/ISignature';

import RollupTransaction from '../../lib/models/rollup/RollupTransaction';

export function getPaymentPayload(
  tx: RollupTransaction,
  from: string,
  to: string
): ITransaction {
  return {
    from: from,
    to: to,
    amount: parseInt(tx.amount.toString()),
    nonce: parseInt(tx.nonce.toString()),
    publicKey: {
      g: {
        x: tx.sender.g.x.toString(),
        y: tx.sender.g.x.toString(),
      },
    },
    signature: undefined,
  };
}

export function signRollupPayment(
  rollupTx: RollupTransaction,
  tx: ITransaction,
  privateKey: PrivateKey
): ITransaction {
  let s: Signature = Signature.create(privateKey, rollupTx.toFields());
  let pubKey = privateKey.toPublicKey();
  let signature: ISignature = {
    publicKey: {
      g: {
        x: pubKey.g.x.toString(),
        y: pubKey.g.y.toString(),
      },
    },
    signature: {
      r: s.r.toJSON()!.toString(),
      s: s.s.toJSON()!.toString(),
    },
    payload: rollupTx.toFields().map((x) => x.toString()),
  };

  tx.signature = signature;

  return tx;
}
