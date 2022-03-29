import ITransaction from '../../lib/models/interfaces/ITransaction';
import DataStore from '../setup/DataStore';
import Service from './Service';
import Indexer from '../indexer/Indexer';
class QueryService extends Service {
  constructor(indexer: typeof Indexer) {
    super(indexer);
  }

  getTransactionPool(): ITransaction[] {
    return DataStore.getTransactionPool()
      .map((tx: any) => {
        return tx.meta_data;
      })
      .concat(
        DataStore.getTransactionHistory().map((tx) => {
          return tx.meta_data;
        })
      )
      .reverse();
  }

  // ! DUMMY CODE
  getAddresses(): any {
    return Object.fromEntries(DataStore.getAccountStore().dataStore);
  }

  stats(): any {
    // just some dummy data
    return {
      average_tps: 14,
      total_addresses: DataStore.getAccountStore().dataStore.size,
      uptime: process.uptime(),
      pending_transactions_count: DataStore.getTransactionPool().length,
    };
  }
}

export default QueryService;
