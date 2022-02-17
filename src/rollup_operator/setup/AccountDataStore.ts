import { KeyedDataStore } from '../../lib/data_store/KeyedDataStore';

import Account from '../../lib/models/rollup/RollupAccount';

class AccountDataStore {
  static instance: KeyedDataStore<string, Account> | undefined;

  constructor() {
    throw new Error(`Use ${this}.getInstance() instead!`);
  }

  static getInstance() {
    if (AccountDataStore.instance === undefined) {
      AccountDataStore.instance = new KeyedDataStore<string, Account>();
    }
    return AccountDataStore.instance;
  }
}

export default AccountDataStore;
