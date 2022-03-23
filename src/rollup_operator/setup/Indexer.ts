/*
! NOTE: This is jsut a dummy data structure and will be improved on in the future
using Facade pattern
*/

import { PSQL, IPFS_Log } from './IndexerOptions';

class Indexer {
  psql: any;
  ipfs_log: any;

  constructor() {
    this.psql = PSQL;
    this.ipfs_log = IPFS_Log;
  }

  /*
  Method to broadcast events/logs/etc to all available data stores (eg ipfs, psql)
  */
  logEvent() {}
}

export default Indexer;
