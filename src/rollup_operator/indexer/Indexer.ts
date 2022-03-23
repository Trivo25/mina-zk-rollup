/*
! NOTE: This is jsut a dummy data structure and will be improved on in the future
using Facade pattern
*/

import { PSQL, IPFS_Log } from './IndexerOptions';

class Indexer {
  psql: any;
  ipfs_log: any;

  constructor(psql: any, log: any) {
    this.psql = psql;
    this.ipfs_log = log;
  }

  /*
  Method to broadcast events/logs/etc to all available data stores (eg ipfs, psql)
  */
  logEvent() {}
}

export default new Indexer(PSQL, IPFS_Log);
