import { PrivateKey, Signature } from 'snarkyjs';
import ITransaction from '../../lib/models/interfaces/ITransaction';
import ISignature from '../../lib/models/interfaces/ISignature';
import RollupTransaction from '../../lib/models/rollup/RollupTransaction';

export function createAndSignPayment(
  tx: RollupTransaction,
  from: string,
  to: string,
  priv: PrivateKey
): ITransaction {
  return {
    from: from,
    to: to,
    amount: parseInt(tx.amount.toString()),
    nonce: parseInt(tx.nonce.toString()),
    sender_publicKey: {
      g: {
        x: tx.sender.g.x.toString(),
        y: tx.sender.g.y.toString(),
      },
    },
    receiver_publicKey: {
      g: {
        x: tx.receiver.g.x.toString(),
        y: tx.receiver.g.y.toString(),
      },
    },
    signature: signRollupPayment(tx, priv),
    payload: tx.toFields().map((x) => x.toString()),
    method: 'simple_transfer',
  };
}

function signRollupPayment(
  rollupTx: RollupTransaction,
  privateKey: PrivateKey
): ISignature {
  let s: Signature = Signature.create(privateKey, rollupTx.toFields());
  let signature: ISignature = {
    r: s.r.toJSON()!.toString(),
    s: s.s.toJSON()!.toString(),
  };

  return signature;
}