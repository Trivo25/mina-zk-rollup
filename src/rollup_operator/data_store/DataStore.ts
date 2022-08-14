/* export default interface DataStore {
  clearInstructions(): void;

  commit(): Promise<void>;

  clear(): Promise<void>;
}
 */

import { AccountStore } from '../../lib/data_store';
import MerkleList from '../proof_system/models/Deposits';
import { RollupState, RollupTransaction } from '../proof_system';

export default interface DataStore {
  accountTree: AccountStore;
  transactionPool: RollupTransaction[];
  transactionHistory: RollupTransaction[];
  pendingDeposits: MerkleList;
  state: {
    committed: RollupState;
    current: RollupState;
  };
}
