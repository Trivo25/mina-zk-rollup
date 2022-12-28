import { EventEmitter } from 'events';
import { AccountStore } from '../../lib/data_store/AccountStore';
import { DepositStore } from '../../lib/data_store/DepositStore';
import { RollupState } from '../../proof_system/state_transition';
import { Transaction } from '../../proof_system/transaction';

export { Service };
export type { GlobalState };

interface GlobalState {
  accountTree: AccountStore;
  transactionPool: Transaction[];
  transactionHistory: Transaction[];
  pendingDeposits: DepositStore;
  state: {
    committed: RollupState;
    current: RollupState;
  };
}

class Service {
  store: GlobalState;
  eventHandler: EventEmitter;
  constructor(store: GlobalState, eventHandler: EventEmitter) {
    this.store = store;
    this.eventHandler = eventHandler;
  }
}
