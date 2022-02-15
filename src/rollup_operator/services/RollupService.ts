import Service from './Service.js';
import * as MinaSDK from '@o1labs/client-sdk';

class RequestService extends Service {
  constructor() {
    super();
  }

  verify(signature: Signature): boolean {
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

    try {
      return MinaSDK.verifyMessage(signed);
    } catch {
      return false;
    }
  }
}

export default RequestService;
