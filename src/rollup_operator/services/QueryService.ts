import ITransaction from '../interfaces/ITransaction';
import TransactionPool from '../setup/TransactionPool';
import Service from './Service';

class QueryService extends Service {
  constructor() {
    super();
  }

  getTransactionPool(): ITransaction[] {
    return TransactionPool.getInstance();
  }
}

export default QueryService;
