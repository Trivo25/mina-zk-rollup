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
} from '../proof_system';
import { Field, PublicKey, Signature, UInt32, UInt64 } from 'snarkyjs';
import { applyTransition } from '../proof_system/sim/apply';
import { verifyTransaction } from '../proof_system/sim/ verify';
import { proverTest } from '../proof_system/sim/proverTest';

class RollupService extends Service {
  constructor(store: DataStore, eventHandler: EventEmitter) {
    super(store, eventHandler);
  }

  async produceRollupBlock() {
    throw new Error('Not implemented');
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
      /*
      let rootBefore = this.store.accountTree.getMerkleRoot()!;

      let appliedTx = applyTransition(rTx, this.store.accountTree);

      let rootAfter = this.store.accountTree.getMerkleRoot()!;
      let stateTransition = new RollupStateTransition(
        new RollupState(Field.zero, rootBefore),
        new RollupState(Field.zero, rootAfter)
      );
      console.log('NONCE IS ', appliedTx.nonce.toString());
      console.log('rootBefore ', rootBefore.toString());
      console.log('rootAfter ', rootAfter.toString());
      proverTest(stateTransition, [appliedTx]);

      */
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default RollupService;
