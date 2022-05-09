import Service from './Service';
import {
  ITransaction,
  ISignature,
  EnumError,
  IPublicKey,
} from '../../lib/models';
import DataStore from '../setup/DataStore';
import { sha256 } from '../../lib/sha256';
import {
  Field,
  Poseidon,
  PrivateKey,
  PublicKey,
  Signature,
  UInt32,
  UInt64,
} from 'snarkyjs';
import {
  signatureFromInterface,
  publicKeyFromInterface,
} from '../../lib/helpers';
import {
  RollupProof,
  RollupTransaction,
  RollupDeposit,
  RollupAccount,
} from '../rollup';
import { DataStack } from '../../lib/data_store';
import Indexer from '../indexer/Indexer';
import { base58Encode } from '../../lib/base_encoding';

class RollupService extends Service {
  constructor(indexer: typeof Indexer) {
    super(indexer);
  }

  static async produceRollupBlock() {
    console.log(
      `Trying to produce a new rollup block with ${
        DataStore.getTransactionPool().length
      } transactions`
    );

    let transactionsToProcess: Array<ITransaction> = new Array<ITransaction>();
    Object.assign(transactionsToProcess, DataStore.getTransactionPool());
    DataStore.getTransactionPool().length = 0;

    transactionsToProcess.forEach((tx) => {
      tx.meta_data.status = 'executed';
    });

    DataStore.getTransactionHistory().push(...transactionsToProcess);

    // TODO: break out both account and pendingdepositst storage
    let pendingDeposits: DataStack<RollupDeposit> =
      new DataStack<RollupDeposit>();

    pendingDeposits.push(
      new RollupDeposit(
        PrivateKey.random().toPublicKey(),
        UInt64.fromNumber(0),
        UInt64.fromNumber(0)
      )
    );

    let accountDb = DataStore.getAccountStore();
    console.log(accountDb.getMerkleRoot()?.toString());
    // TODO: verify that on-chain merkle root actually matches with the one known to the operator

    console.log(
      `Current state root ${base58Encode(
        DataStore.getAccountStore().getMerkleRoot()!.toString()
      )}`
    );
    console.log(`Processing ${transactionsToProcess.length} transactions`);
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
        console.log(`Discontinuing proof production, got error ${error}`);
        tx.meta_data.status = 'failed';
      }
    });

    if (proofBatch.length === 0) {
      console.log(`Block contained no valid proofs, continuing..`);
      return;
    }
    try {
      console.log(
        `Producing master proof, consisting of ${proofBatch.length} child proofs`
      );
      let masterProof = RollupProof.mergeBatch(proofBatch);
      console.log(`Sucessfully produced a new master proof`);

      DataStore.getBlocks().push({
        transactions: transactionsToProcess,
        status: 'executed',
        new_state_root: base58Encode(
          masterProof.publicInput.target.accountDbCommitment.toString()
        ),
        previous_state_root: base58Encode(
          masterProof.publicInput.source.accountDbCommitment.toString()
        ),
        id: (DataStore.getBlocks().length + 1).toString(),
        time: Date.now().toString(),
      });
      console.log(`Sucessfully produced a new rollup block`);
      console.log(
        `Master proof target root ${base58Encode(
          masterProof.publicInput.target.accountDbCommitment.toString()
        )}`
      );
      console.log(
        `Master proof source root ${base58Encode(
          masterProof.publicInput.source.accountDbCommitment.toString()
        )}`
      );
      console.log(
        `New state root ${base58Encode(
          DataStore.getAccountStore().getMerkleRoot()!.toString()
        )}`
      );
    } catch (error) {
      console.log(error);
    }
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

    console.log(`New incoming transaction`);
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
      RollupService.produceRollupBlock();
      //EventHandler.emit(Events.PENDING_TRANSACTION_POOL_FULL);
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

export default RollupService;
