import Log from 'ipfs-log';
import IdentityProvider from 'orbit-db-identity-provider';
import * as IPFS from 'ipfs';
const identity = await IdentityProvider.createIdentity({ id: 'peerid' });
const ipfs = await IPFS.create({ repo: './temp/log.data' });

// dummy data
class PSQL {
  constructor() {}
}
let PSQL_INSTANCE: any;
let IPFS_Log: any;
try {
  PSQL_INSTANCE = new PSQL();
  IPFS_Log = new Log(ipfs, identity)();
} catch (error) {
  console.log(error);
}

export { PSQL_INSTANCE as PSQL, IPFS_Log };
