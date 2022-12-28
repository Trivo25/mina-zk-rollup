import { Service, GlobalState } from './Service.js';
import { EventEmitter } from 'events';

class QueryService extends Service {
  constructor(store: GlobalState, eventHandler: EventEmitter) {
    super(store, eventHandler);
  }

  getTransactionPool(): any[] {
    return this.store.transactionPool.map((tx) => {
      return JSON.stringify(tx);
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
      return JSON.stringify(tx);
    });
  }

  getTransactionHistoryForAddress(address: string): any {
    return null;
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
      ledgerHeight: 255,
      depositHeight: 8,
      totalAccounts: this.store.accountTree.size,
      totalTransactions: this.store.transactionHistory.length,
    };
  }

  getBlocks(): any {
    return null;
  }
}

export default QueryService;
