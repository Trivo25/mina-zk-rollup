import IPublicKey from './IPublicKey';
import ISignature from './ISignature';

/**
 * Interface for REST API transactions.
 */
export default interface ITransaction {
  // meta_data contains unimportant information eg. sender receiver encoded public key, perhaps a memo, perhaps some other information
  meta_data: {
    from: string;
    to: string;
    amount: number;
    nonce: number;
    method: string;
    hash?: string;
    fee?: string;
    time?: string;
    status?: string;
  };
  // transaction_data includes the important information such as signature and payload
  transaction_data: {
    sender_publicKey: IPublicKey;
    receiver_publicKey: IPublicKey;
    payload: string[];
    signature: ISignature;
  };
}
