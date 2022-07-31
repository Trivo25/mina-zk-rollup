import { PrivateKey, Field, Signature } from 'snarkyjs';
import { ITransaction } from '../../lib/models';
import { RollupTransaction } from '../../rollup_operator/proof_system';

export const signTx = (tx: ITransaction, priv: PrivateKey): ITransaction => {
  let payload: Field[] = RollupTransaction.fromInterface(tx).toFields();
  let sig = Signature.create(priv, payload);

  tx.signature = {
    r: sig.r.toString(),
    s: sig.s.toJSON()?.toString()!,
  };

  return tx;
};
