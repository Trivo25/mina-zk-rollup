import Service from './Service';
import ISignature from '../../lib/models/interfaces/ISignature';
import ITransaction from '../../lib/models/interfaces/ITransaction';
import EnumError from '../../lib/models/enums/EnumError';
import DataStore from '../setup/DataStore';
import { sha256 } from '../../lib/sha256';
import EventHandler from '../setup/EvenHandler';
import Events from '../../lib/models/enums/Events';
import {
  Field,
  Poseidon,
  PrivateKey,
  PublicKey,
  Signature,
  UInt32,
  UInt64,
} from 'snarkyjs';
import signatureFromInterface from '../../lib/helpers/signatureFromInterface';
import publicKeyFromInterface from '../../lib/helpers/publicKeyFromInterface';
import IPublicKey from '../../lib/models/interfaces/IPublicKey';
import RollupProof from '../rollup/RollupProof';
import RollupTransaction from '../rollup/models/RollupTransaction';
import { MerkleStack } from '../../lib/data_store/DataStack';
import RollupDeposit from '../rollup/models/RollupDeposit';
import RollupAccount from '../rollup/models/RollupAccount';
import Indexer from '../indexer/Indexer';
import { base58Decode, base58Encode } from '../../lib/baseEncoding';
import minaToNano from '../../lib/helpers/minaToNano';

class RequestService extends Service {
  constructor(indexer: typeof Indexer) {
    super(indexer);
  }

  static async produceRollupBlock() {
    console.log(
      `producing a new rollup block with ${
        DataStore.getTransactionPool().length
      } transctions`
    );

    let transactionsToProcess: Array<ITransaction> = new Array<ITransaction>();
    Object.assign(transactionsToProcess, DataStore.getTransactionPool());
    DataStore.getTransactionPool().length = 0;

    transactionsToProcess.forEach((tx) => {
      tx.meta_data.status = 'executed';
    });

    DataStore.getTransactionHistory().push(...transactionsToProcess);

    // TODO: break out both account and pendingdepositst storage
    let pendingDeposits: MerkleStack<RollupDeposit> =
      new MerkleStack<RollupDeposit>();

    pendingDeposits.push(
      new RollupDeposit(PrivateKey.random().toPublicKey(), UInt64.fromNumber(0))
    );

    let accountDb = DataStore.getAccountStore();

    // TODO: verify that on-chain merkle root actually matches with the one known to the operator

    let proofBatch: RollupProof[] = [];
    transactionsToProcess.forEach(async (tx) => {
      try {
        let signature: Signature = signatureFromInterface(
          tx.transaction_data.signature
        );
        let rollupTx: RollupTransaction = RollupTransaction.deserializePayload(
          tx.transaction_data.payload.map((f: string) => Field(f))
        );

        let p: RollupProof = RollupProof.simpleTransfer(
          rollupTx,
          signature,
          pendingDeposits,
          accountDb
        );
        proofBatch.push(p);
        tx.meta_data.status = 'executed';
      } catch (error) {
        console.log(error);
        tx.meta_data.status = 'failed';
      }
    });

    console.log('producing master proof');
    let masterProof = RollupProof.mergeBatch(proofBatch);
    console.log(masterProof);
  }

  /**
   * Verifies a signature
   * @param signature Signature to verify
   * @returns true if signature is valid
   */
  verify(signature: ISignature, payload: string[], publicKey: IPublicKey): any {
    try {
      let fieldPayload: Field[] = payload.map((f: any) => Field(f));
      let pub = publicKeyFromInterface(publicKey);
      let sig = signatureFromInterface(signature);

      return {
        is_valid: sig.verify(pub, fieldPayload).toBoolean(),
      };
    } catch {
      throw new Error(EnumError.BrokenSignature);
    }
  }

  processTransaction(transaction: ITransaction): any {
    // verify signature so no faulty signature makes it into the pool

    let signature: Signature = signatureFromInterface(
      transaction.transaction_data.signature
    );

    let sender: PublicKey = publicKeyFromInterface(
      transaction.transaction_data.sender_publicKey
    );
    let payload: Field[] = transaction.transaction_data.payload.map((f) =>
      Field(f)
    );

    if (sender === undefined) {
      throw new Error(EnumError.InvalidPublicKey);
    }

    if (signature === undefined) {
      throw new Error(EnumError.InvalidSignature);
    }
    if (!signature.verify(sender, payload).toBoolean()) {
      throw new Error(EnumError.InvalidSignature);
    }

    transaction.meta_data.hash =
      'ROLLUP' + sha256(Poseidon.hash(signature.toFields()).toString());

    transaction.meta_data.status = 'pending';

    let poolSize = DataStore.getTransactionPool().push(transaction);

    // TODO: use config for block size
    // NOTE: define a more precise way to produce blocks; either by filling up a block or producing a block every x hours/minutes
    // maybe even introduce a global state the operator has access to, including a variable LAST_PRODUCED_ROLLUP_TIME
    // if LAST_PRODUCED_ROLLUP_TIME <= CURRENT_TIME exceeds eg 1hr, produce a block
    // if poolSize >= TARGET_ROLLUP_BLOCK_SIZE produce a block
    if (poolSize >= 2) {
      EventHandler.emit(Events.PENDING_TRANSACTION_POOL_FULL);
    }

    return {
      transcaction_hash: transaction.meta_data.hash,
    };
  }

  // ! dummy data!
  createAccount(): any {
    let priv = PrivateKey.random();

    let newAcc = new RollupAccount(
      new UInt64(Field(1000)),
      priv.toPublicKey(),
      UInt32.fromNumber(0)
    );
    let pub = base58Encode(JSON.stringify(priv.toPublicKey().toJSON()));
    DataStore.getAccountStore().set(pub, newAcc);

    return {
      priv: priv,
      pub_enc: pub,
    };
  }
}

export default RequestService;
