class DataStore {
  getTransactionPool(): any {
    throw new Error('Method not implemented.');
  }
  getTransactionHistory() {
    throw new Error('Method not implemented.');
  }
  getAccountStore() {
    throw new Error('Method not implemented.');
  }

  store: any;

  constructor() {}
}

export default DataStore;
