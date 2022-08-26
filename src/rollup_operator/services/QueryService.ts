import Service from './Service';
import { DataStore } from '../data_store';
import { EventEmitter } from 'events';
import Config from '../../config/config';
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
        hash: tx.getBase58Hash(),
      };
    });
  }

  getAccounts(): any {
    let xs = [];
    for (let [, val] of this.store.accountTree.entries()) {
      xs.push({
        publicKey: val.address,
        balance: val.balance.toString(),
        nonce: val.nonce.toString(),
        hash: val.getBase58Hash(),
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
        hash: tx.getBase58Hash(),
      };
    });
  }

  getTransactionHistoryForAddress(address: string): any {
    return this.store.transactionHistory
      .filter(
        (tx) => tx.from.toBase58() == address || tx.to.toBase58() == address
      )
      .map((tx) => {
        return {
          to: tx.to.toBase58(),
          from: tx.from.toBase58(),
          amount: tx.amount.toString(),
          nonce: tx.nonce.toString(),
          type: tx.type,
          state: tx.state.toString(),
          hash: tx.getBase58Hash(),
        };
      });
  }

  getPendingDeposits(): any {
    let xs = [];
    for (let [, val] of this.store.pendingDeposits.entries()) {
      xs.push({
        publicKey: val.publicKey.toBase58(),
        to: val.to.toBase58(),
        amount: val.amount.toString(),
        tokenId: val.tokenId.toString(),
        hash: val.getBase58Hash(),
      });
    }
    return xs;
  }

  stats(): any {
    return {
      stateRoot: this.store.accountTree.getMerkleRoot()?.toString(),
      ledgerHeight: Config.ledgerHeight,
      depositHeight: Config.depositHeight,
      totalAccounts: this.store.accountTree.size,
      totalTransactions: this.store.transactionHistory.length,
    };
  }

  getBlocks(): any {
    return null;
  }
}

export default QueryService;
