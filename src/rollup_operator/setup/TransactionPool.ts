import ITransaction from '../../lib/models/interfaces/ITransaction';

class TransactionPool {
  static instance: Array<ITransaction> | undefined;

  constructor() {
    throw new Error(`Use ${this}.getInstance() instead!`);
  }

  static getInstance() {
    if (TransactionPool.instance === undefined) {
      TransactionPool.instance = new Array<ITransaction>();
    }
    return TransactionPool.instance;
  }
}

export default TransactionPool;
