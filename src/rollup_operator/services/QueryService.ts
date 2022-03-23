import ITransaction from '../../lib/models/interfaces/ITransaction';
import DataStore from '../setup/DataStore';
import Service from './Service';
import Indexer from '../indexer/Indexer';
class QueryService extends Service {
  constructor(indexer: Indexer) {
    super(indexer);
  }

  getTransactionPool(): ITransaction[] {
    return DataStore.getTransactionPool();
  }

  stats(): any {
    // just some dummy data
    return {
      average_tps: 14,
      uptime: '3d 4h 32m',
      pending_transactions_count: DataStore.getTransactionPool().length,
    };
  }
}

export default QueryService;
