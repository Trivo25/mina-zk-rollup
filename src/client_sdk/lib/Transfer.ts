import * as MinaSDK from '@o1labs/client-sdk';
import ITransaction from '../../rollup_operator/interfaces/ITransaction';

export function getPaymentPayload(
  from: string,
  to: string,
  amount: number,
  nonce: number,
  memo: string
): ITransaction {
  return {
    from: from,
    to: to,
    amount: amount,
    nonce: nonce,
    memo: memo,
    signature: undefined,
    time_received: undefined,
    hash: undefined,
  };
}

export function signRollupPayment(
  tx: ITransaction,
  keys: MinaSDK.keypair
): MinaSDK.signed<string> {
  return MinaSDK.signMessage(JSON.stringify(tx), keys);
}