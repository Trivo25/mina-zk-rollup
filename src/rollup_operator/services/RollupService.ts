import Service from './Service';
import * as MinaSDK from '@o1labs/client-sdk';
import ISignature from '../models/ISignature';
import ITransaction from '../models/ITransaction';

class RequestService extends Service {
  constructor() {
    super();
  }

  /**
   * Verifies a signature
   * @param signature Signature to verify
   * @returns true if signature is valid
   */
  verify(signature: ISignature): boolean {
    try {
      let minaSignature: MinaSDK.signature = {
        field: signature.signature.field,
        scalar: signature.signature.scalar,
      };

      let minaPayload: MinaSDK.signable = signature.payload;
      let signed: MinaSDK.signed<string> = {
        publicKey: signature.publicKey,
        signature: minaSignature,
        payload: minaPayload,
      };

      return MinaSDK.verifyMessage(signed);
    } catch {
      return false;
    }
  }

  processTransaction(transaction: ITransaction, signature: ISignature) {}
}

export default RequestService;
