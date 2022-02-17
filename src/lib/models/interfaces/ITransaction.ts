import IPublicKey from './IPublicKey';
import ISignature from './ISignature';

export default interface ITransaction {
  from: string;
  to: string;
  amount: number;
  nonce: number;
  publicKey: IPublicKey;
  payload: string[];
  signature: ISignature;
}
