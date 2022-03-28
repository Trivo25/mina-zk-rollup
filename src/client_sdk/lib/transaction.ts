import { PrivateKey, Signature } from 'snarkyjs';
import ITransaction from '../../lib/models/interfaces/ITransaction';
import ISignature from '../../lib/models/interfaces/ISignature';
import RollupTransaction from '../../rollup_operator/rollup/models/RollupTransaction';

export function createAndSignPayment(
  tx: RollupTransaction,
  from: string,
  to: string,
  priv: PrivateKey
): ITransaction {
  return {
    meta_data: {
      from: from,
      to: to,
      amount: parseInt(tx.amount.toString()),
      nonce: parseInt(tx.nonce.toString()),
      method: 'simple_transfer',
    },
    transaction_data: {
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
    },
  };
}

function signRollupPayment(
  rollupTx: RollupTransaction,
  privateKey: PrivateKey
): ISignature {
  // TODO: Hash the tx fieds and sign the hash instead of hasing the entire tx
  let s: Signature = Signature.create(privateKey, rollupTx.toFields());
  let signature: ISignature = {
    r: s.r.toJSON()!.toString(),
    s: s.s.toJSON()!.toString(),
  };

  return signature;
}
