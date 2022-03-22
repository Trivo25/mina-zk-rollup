import Log from 'ipfs-log';
import IdentityProvider from 'orbit-db-identity-provider';
import * as IPFS from 'ipfs';
const identity = await IdentityProvider.createIdentity({ id: 'peerid' });
const ipfs = await IPFS.create({ repo: './temp/log.data' });
export default new Log(ipfs, identity);
