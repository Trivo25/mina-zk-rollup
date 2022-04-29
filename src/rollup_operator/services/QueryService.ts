import { ITransaction } from '../../lib/models';
import DataStore from '../setup/DataStore';
import Service from './Service';
import Indexer from '../indexer/Indexer';
class QueryService extends Service {
  constructor(indexer: typeof Indexer) {
    super(indexer);
  }

  getTransactionPool(): ITransaction[] {
    return DataStore.getTransactionHistory()
      .map((tx: any) => {
        return tx.meta_data;
      })
      .concat(
        DataStore.getTransactionPool().map((tx) => {
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
    let txCount = DataStore.getTransactionPool().concat(
      DataStore.getTransactionHistory()
    ).length;
    // just some dummy data
    return {
      average_tps: txCount / process.uptime(),
      total_transactions: txCount,
      total_addresses: DataStore.getAccountStore().dataStore.size,
      uptime: process.uptime(),
      pending_transactions_count: DataStore.getTransactionPool().length,
    };
  }

  getBlocks(): any {
    return DataStore.getBlocks().reverse();
  }
}

export default QueryService;
