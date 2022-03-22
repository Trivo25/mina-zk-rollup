import Indexer from '../setup/Indexer';
import Log from 'ipfs-log';
import IdentityProvider from 'orbit-db-identity-provider';
import * as IPFS from 'ipfs';

class Service {
  indexer: Indexer;
  constructor(indexer: Indexer) {
    this.indexer = indexer;
  }
}

const identity = await IdentityProvider.createIdentity({ id: 'peerid' });
const ipfs = await IPFS.create({ repo: './temp/log.data' });
let indexer = new Indexer({
  ipfs_log: new Log(ipfs, identity),
  ipfs_account: null,
  local: {
    type: 'psql',
    instance: null,
  },
});

export default new Service(indexer);
