import { AccountStore } from '../../lib/data_store/AccountStore.js';
import DepositStore from '../../lib/data_store/DepositStore';
import { RollupState } from '../../proof_system/state_transition';
import { RollupTransaction } from '../../proof_system/transaction';

export type { DataStore };

interface DataStore {
  accountTree: AccountStore;
  transactionPool: RollupTransaction[];
  transactionHistory: RollupTransaction[];
  pendingDeposits: DepositStore;
  state: {
    committed: RollupState;
    current: RollupState;
  };
}
