import Service from './Service';
import * as MinaSDK from '@o1labs/client-sdk';
import ISignature from '../models/ISignature';
import ITransaction from '../models/ITransaction';
import EnumError from '../models/EnumError';

class RequestService extends Service {
  constructor() {
    super();
  }

  /**
   * Verifies a signature
   * @param signature Signature to verify
   * @returns true if signature is valid
   */
  verify(signature: ISignature): boolean | EnumError {
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

      return MinaSDK.verifyMessage(signed) ? true : EnumError.InvalidSignature;
    } catch {
      return EnumError.BrokenSignature;
    }
  }

  processTransaction(
    transaction: ITransaction,
    signature: ISignature
  ): boolean | EnumError {
    // verify signature so no faulty signatre makes it into the pool

    if (!MinaSDK.verifyMessage(signature)) {
      return EnumError.InvalidSignature;
    }

    return true;
  }
}

export default RequestService;
