/* export default interface DataStore {
  clearInstructions(): void;

  commit(): Promise<void>;

  clear(): Promise<void>;
}
 */

import { AccountStore } from '../../lib/data_store';
import { RollupState, RollupTransaction } from '../proof_system';
import DepositStore from '../../lib/data_store/DepositStore';

export default interface DataStore {
  accountTree: AccountStore;
  transactionPool: RollupTransaction[];
  transactionHistory: RollupTransaction[];
  pendingDeposits: DepositStore;
  state: {
    committed: RollupState;
    current: RollupState;
  };
}
