import ISignature from './ISignature';

export default interface ITtransaction {
  from: string;
  to: string;
  amount: number;
  nonce: number;
  memo: string;
  signature: ISignature | undefined;
  time_received: string | undefined;
  hash: string | undefined;
}
