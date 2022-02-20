import IPublicKey from './IPublicKey';
import ISignature from './ISignature';

/**
 * Interface for REST API transactions.
 */
export default interface ITransaction {
  from: string;
  to: string;
  amount: number;
  nonce: number;
  sender_publicKey: IPublicKey;
  receiver_publicKey: IPublicKey;
  payload: string[];
  signature: ISignature;
  method: string;
  hash?: string;
}
