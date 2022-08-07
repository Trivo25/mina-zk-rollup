import Service from './Service';
import { DataStore } from '../data_store';
import { EventEmitter } from 'events';

class QueryService extends Service {
  constructor(store: DataStore, eventHandler: EventEmitter) {
    super(store, eventHandler);
  }

  getTransactionPool(): any[] {
    return this.store.transactionPool.map((tx) => {
      return {
        to: tx.to.toBase58(),
        from: tx.from.toBase58(),
        amount: tx.amount.toString(),
        nonce: tx.nonce.toString(),
      };
    });
  }

  getAccounts(): any {
    let xs = [];
    for (let [, val] of this.store.accountTree.dataStore.entries()) {
      xs.push({
        publicKey: val.address,
        balance: val.balance.toString(),
        nonce: val.nonce.toString(),
      });
    }
    return xs;
  }

  getTransactionHistory(): any {
    return this.store.transactionHistory.map((tx) => {
      return {
        to: tx.to.toBase58(),
        from: tx.from.toBase58(),
        amount: tx.amount.toString(),
        nonce: tx.nonce.toString(),
        type: tx.type,
        state: tx.state.toString(),
      };
    });
  }

  stats(): any {
    return {
      stateRoot: this.store.accountTree.getMerkleRoot()?.toString(),
      totalAccounts: this.store.accountTree.dataStore.size,
      totalTransactions: this.store.transactionHistory.length,
    };
  }

  getBlocks(): any {
    return null;
  }
}

export default QueryService;
