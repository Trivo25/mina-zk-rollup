import Service from './Service';
import * as MinaSDK from '@o1labs/client-sdk';
import ISignature from '../interfaces/ISignature';
import ITransaction from '../interfaces/ITransaction';
import EnumError from '../interfaces/EnumError';
import TransactionPool from '../setup/TransactionPool';
import { sha256 } from '../../lib/sha256';
import EventHandler from '../setup/EvenHandler';
import Events from '../interfaces/Events';

class RequestService extends Service {
  constructor() {
    super();
  }

  static produceRollupBlock() {
    console.log(
      `producing a new rollup block with ${
        TransactionPool.getInstance().length
      } transctions`
    );

    let transactionsToProcess: Array<ITransaction> = new Array<ITransaction>();
    Object.assign(transactionsToProcess, TransactionPool.getInstance());
    TransactionPool.getInstance().length = 0;
    console.log(transactionsToProcess);
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

    let poolSize = TransactionPool.getInstance().push(transaction);

    // TODO: use config for block size
    // NOTE: define a more precise way to produce blocks; either by filling up a block or producing a block every x hours/minutes
    // maybe even introduce a global state the operator has access to, including a variable LAST_PRODUCED_ROLLUP_TIME
    // if LAST_PRODUCED_ROLLUP_TIME <= CURRENT_TIME exceeds eg 1hr, produce a block
    // if poolSize >= TARGET_ROLLUP_BLOCK_SIZE produce a block
    if (poolSize >= 5) {
      EventHandler.getInstance().emit(Events.PENDING_TRANSACTION_POOL_FULL);
    }

    return transaction.hash!;
  }
}

export default RequestService;
