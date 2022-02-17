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
    publicKey: {
      g: {
        x: tx.sender.g.x.toString(),
        y: tx.sender.g.x.toString(),
      },
    },
    signature: signRollupPayment(tx, priv),
    payload: tx.toFields().map((x) => x.toString()),
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
