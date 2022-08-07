/* eslint-disable no-unused-vars */
import Service from './Service';
import { ITransaction } from '../../lib/models';
import { DataStore } from '../data_store';
import { base58Encode, sha256 } from '../../lib/helpers';
import SequencerEvents from '../events/events';
import { EventEmitter } from 'events';
import {
  RollupState,
  RollupStateTransition,
  RollupTransaction,
  TransactionBatch,
} from '../proof_system';
import {
  Field,
  PublicKey,
  Signature,
  UInt32,
  UInt64,
  ZkProgram,
} from 'snarkyjs';
import { applyTransition } from '../proof_system/sim/apply';
import { verifyTransaction } from '../proof_system/sim/verify';
import { proverTest } from '../proof_system/sim/proverTest';
import Config from '../../config/config';
import { Prover } from '../proof_system/prover';
import { RollupZkApp } from '../../zkapp/RollupZkApp';
import { ContractInterface } from '../blockchain';

class RollupService extends Service {
  prover;
  contract;

  constructor(
    store: DataStore,
    eventHandler: EventEmitter,
    prover: any,
    contract: ContractInterface
  ) {
    super(store, eventHandler);
    this.prover = prover;
    this.contract = contract;
  }

  async produceRollupBlock() {
    let rootBefore = this.store.accountTree.getMerkleRoot()!;
    let appliedTxns: RollupTransaction[] = [];

    this.store.transactionPool.forEach((tx) => {
      try {
        let aTx = applyTransition(tx, this.store.accountTree);
        appliedTxns.push(aTx);
      } catch (error) {
        console.log('Skipping invalid tx');
      }
    });
    this.store.transactionPool = [];
    let rootAfter = this.store.accountTree.getMerkleRoot()!;
    let stateTransition = new RollupStateTransition(
      new RollupState(Field.zero, rootBefore),
      new RollupState(Field.zero, rootAfter)
    );

    if (!Config.prover.produceProof) {
      console.log('dummy prover test');
      proverTest(stateTransition, appliedTxns);
    } else {
      console.log('producing proofs');
      console.time('txProof');

      let proof = await Prover.proveTransaction(
        stateTransition,
        TransactionBatch.fromElements(appliedTxns)
      );
      //console.log(proof.verify());
      console.timeEnd('txProof');
      console.log('-----');
      this.contract.submitProof(stateTransition, proof);
    }
    this.store.transactionHistory.push(...appliedTxns);
  }

  /**
   * Verifies a tx signature
   * @param tx tx signature to verify
   * @returns true if signature is valid
   */
  async verify(tx: ITransaction): Promise<boolean> {
    try {
      let rTx = RollupTransaction.fromInterface(tx);
      return rTx.signature.verify(rTx.from, rTx.toFields()).toBoolean();
    } catch (error) {
      return false;
    }
  }

  async processTransaction(tx: ITransaction): Promise<any> {
    try {
      let rTx = RollupTransaction.fromInterface(tx);

      rTx.signature.verify(rTx.from, rTx.toFields()).assertTrue();

      verifyTransaction(
        rTx,
        this.store.accountTree.get(tx.from)!.clone(),
        this.store.accountTree.get(tx.to)!.clone()
      );

      this.store.transactionPool.push(rTx);
      console.log(
        `Got ${this.store.transactionPool.length} transactions in pool`
      );

      if (this.store.transactionPool.length >= Config.app.batchSize) {
        await this.produceRollupBlock();
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default RollupService;
