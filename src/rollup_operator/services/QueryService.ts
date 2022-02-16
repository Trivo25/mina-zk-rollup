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

  stats(): any {
    // just some dummy data
    return {
      average_tps: 14,
      uptime: '3d 4h 32m',
      pending_transactions_count: TransactionPool.getInstance().length,
    };
  }
}

export default QueryService;
