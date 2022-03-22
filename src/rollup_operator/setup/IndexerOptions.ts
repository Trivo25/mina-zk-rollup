import Log from 'ipfs-log';
import IdentityProvider from 'orbit-db-identity-provider';
import * as IPFS from 'ipfs';
const identity = await IdentityProvider.createIdentity({ id: 'peerid' });
const ipfs = await IPFS.create({ repo: './temp/log.data' });

const Local = {
  type: 'psql',
  instance: Math.random(),
};
const IPFS_Log = new Log(ipfs, identity);

export { Local, IPFS_Log };
export type { Options };
