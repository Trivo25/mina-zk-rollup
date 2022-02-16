import Service from './Service';
import * as MinaSDK from '@o1labs/client-sdk';
import ISignature from '../interfaces/ISignature';
import ITransaction from '../interfaces/ITransaction';
import EnumError from '../interfaces/EnumError';
import TransactionPool from '../setup/TransactionPool';
import { transaction } from 'snarkyjs/dist/server/lib/mina';
import { sha256 } from '../../lib/sha256';

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

  processTransaction(transaction: ITransaction): string | EnumError {
    // verify signature so no faulty signature makes it into the pool

    if (
      transaction.signature === undefined ||
      !MinaSDK.verifyMessage(transaction.signature!)
    ) {
      return EnumError.InvalidSignature;
    }
    transaction.hash = sha256(JSON.stringify(transaction.signature));

    TransactionPool.getInstance().push(transaction);

    return transaction.hash!;
  }
}

export default RequestService;
