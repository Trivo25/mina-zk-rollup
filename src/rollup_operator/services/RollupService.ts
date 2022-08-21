/* eslint-disable no-unused-vars */
import Service from './Service';
import { EnumFinality, IDeposit, ITransaction } from '../../lib/models';
import { DataStore } from '../data_store';
import { EventEmitter } from 'events';
import {
  RollupDeposit,
  RollupState,
  RollupStateTransition,
  RollupTransaction,
  TransactionBatch,
} from '../proof_system';
import { Field } from 'snarkyjs';
import { applyTransitionSimulation } from '../proof_system/sim/apply';
import { proverTest } from '../proof_system/sim/proverTest';
import Config from '../../config/config';
import { Prover } from '../proof_system/prover';
import { Contract } from '../contract';
import logger from '../../lib/log';

class RollupService extends Service {
  prover;
  contract;

  constructor(
    store: DataStore,
    eventHandler: EventEmitter,
    prover: any,
    contract: Contract
  ) {
    super(store, eventHandler);
    this.prover = prover;
    this.contract = contract;
  }

  async produceTransactionBatch() {
    logger.info('Producing new rollup block..');

    // have to copy tx pool before new ones land
    let appliedTxns: RollupTransaction[] = [...this.store.transactionPool];
    appliedTxns.forEach((tx) => (tx.state = EnumFinality.PROVING));
    this.store.transactionPool = []; // clean up transaction pool

    let current = new RollupState(
      Field.fromString(this.store.pendingDeposits.getMerkleRoot().toString()),
      Field.fromString(this.store.accountTree.getMerkleRoot().toString())
    );

    let stateTransition = new RollupStateTransition(
      this.store.state.committed,
      current
    );

    if (!Config.prover.produceProof) {
      logger.log('Using dummy prover');
      proverTest(stateTransition, appliedTxns);
    } else {
      logger.info('Using real prover');
      logger.log('proof generation time');
      console.time('t');
      let proof = await Prover.proveTransactionBatch(
        stateTransition,
        TransactionBatch.fromElements(appliedTxns)
      );
      console.timeEnd('t');
      //this.contract.submitStateTransition(proof);
      logger.info('Transition proof submitted!');
    }
    appliedTxns.forEach((tx) => (tx.state = EnumFinality.PROVEN));
    this.store.transactionHistory.push(...appliedTxns);
    logger.info('New rollup block produced!');
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
      logger.info('Received new transaction');

      let rTx = RollupTransaction.fromInterface(tx);

      let isValid = rTx.signature.verify(rTx.from, rTx.toFields()).toBoolean();
      if (!isValid) throw new Error('Invalid signature.');

      try {
        let aTx = applyTransitionSimulation(rTx, this.store.accountTree);
        this.store.transactionPool.push(aTx);
      } catch (error) {
        rTx.state = EnumFinality.REJECTED;
        this.store.transactionHistory.push(rTx);
        logger.warn('Skipping invalid transaction');
      }

      logger.info(
        `Got ${this.store.transactionPool.length} transactions in pool`
      );

      if (this.store.transactionPool.length >= Config.batchSize) {
        await this.produceTransactionBatch();
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async processDeposit(tx: IDeposit): Promise<any> {
    try {
      logger.info('Received new deposit');

      let rTx = RollupDeposit.fromInterface(tx);
      rTx.signature.verify(rTx.publicKey, rTx.toFields()).assertTrue();
      // TODO: continue
      if (this.store.pendingDeposits.get(BigInt(tx.index)) === undefined) {
        throw new Error('Deposit slot already full');
      }
      this.store.pendingDeposits.set(BigInt(tx.index), rTx);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default RollupService;
