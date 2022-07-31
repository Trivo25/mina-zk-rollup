/* export default interface DataStore {
  clearInstructions(): void;

  commit(): Promise<void>;

  clear(): Promise<void>;
}
 */

import { KeyedDataStore } from '../../lib/data_store';
import { RollupAccount, RollupTransaction } from '../proof_system';

export default interface DataStore {
  accountTree: KeyedDataStore<string, RollupAccount>;
  transactionPool: RollupTransaction[];
  transactionHistory: RollupTransaction[];
}
