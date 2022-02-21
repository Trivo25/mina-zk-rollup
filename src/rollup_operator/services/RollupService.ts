import Service from './Service';
import ISignature from '../../lib/models/interfaces/ISignature';
import ITransaction from '../../lib/models/interfaces/ITransaction';
import EnumError from '../../lib/models/interfaces/EnumError';
import DataStore from '../setup/DataStore';
import { sha256 } from '../../lib/sha256';
import EventHandler from '../setup/EvenHandler';
import Events from '../../lib/models/interfaces/Events';
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
import RollupProof from '../proof/RollupProof';
import RollupTransaction from '../../lib/models/rollup/RollupTransaction';
import { MerkleStack } from '../../lib/data_store/MerkleStack';
import RollupDeposit from '../../lib/models/rollup/RollupDeposit';
import { KeyedMerkleStore } from '../../lib/data_store/KeyedMerkleStore';
import RollupAccount from '../../lib/models/rollup/RollupAccount';

class RequestService extends Service {
  constructor() {
    super();
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

    // TODO: break out both account and pendingdepositst storage
    let pendingDeposits: MerkleStack<RollupDeposit> =
      new MerkleStack<RollupDeposit>();

    pendingDeposits.push(
      new RollupDeposit(PrivateKey.random().toPublicKey(), UInt64.fromNumber(0))
    );

    let accountDb: KeyedMerkleStore<string, RollupAccount> =
      new KeyedMerkleStore<string, RollupAccount>();

    accountDb.set(
      Poseidon.hash(
        publicKeyFromInterface(
          transactionsToProcess[0].transaction_data.sender_publicKey
        ).toFields()
      ).toString(),
      new RollupAccount(
        UInt64.fromNumber(500),
        publicKeyFromInterface(
          transactionsToProcess[0].transaction_data.sender_publicKey
        ),
        UInt32.fromNumber(0)
      )
    );

    let proofBatch: RollupProof[] = [];
    transactionsToProcess.forEach(async (tx) => {
      try {
        let signature: Signature = signatureFromInterface(
          tx.transaction_data.signature
        );
        let rollupTx: RollupTransaction = RollupTransaction.deserializePayload(
          tx.transaction_data.payload.map((f: string) => Field(f))
        );
        console.log(
          'SENDER BEFORE:',
          accountDb
            .get(Poseidon.hash(rollupTx.sender.toFields()).toString())!
            .balance.toString()
        );

        let p: RollupProof = RollupProof.simpleTransfer(
          rollupTx,
          signature,
          pendingDeposits,
          accountDb
        );
        console.log(
          'SENDER AFTER:',
          accountDb
            .get(Poseidon.hash(rollupTx.sender.toFields()).toString())!
            .balance.toString()
        );
        console.log(
          'RECEIVER AFTER:',
          accountDb
            .get(Poseidon.hash(rollupTx.receiver.toFields()).toString())!
            .balance.toString()
        );
        proofBatch.push(p);
      } catch (error) {
        console.log(error);
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

    let poolSize = DataStore.getTransactionPool().push(transaction);

    // TODO: use config for block size
    // NOTE: define a more precise way to produce blocks; either by filling up a block or producing a block every x hours/minutes
    // maybe even introduce a global state the operator has access to, including a variable LAST_PRODUCED_ROLLUP_TIME
    // if LAST_PRODUCED_ROLLUP_TIME <= CURRENT_TIME exceeds eg 1hr, produce a block
    // if poolSize >= TARGET_ROLLUP_BLOCK_SIZE produce a block
    if (poolSize >= 1) {
      EventHandler.emit(Events.PENDING_TRANSACTION_POOL_FULL);
    }

    return {
      transcaction_hash: transaction.meta_data.hash,
    };
  }
}

export default RequestService;
