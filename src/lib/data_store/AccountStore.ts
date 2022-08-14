import { PublicKey } from 'snarkyjs';
import { RollupAccount } from '../../rollup_operator/proof_system';
import KeyedDataStore from './KeyedDataStore';
import Config from '../../config/config';

export default class AccountStore extends KeyedDataStore<RollupAccount> {
  constructor() {
    super(Config.ledgerHeight);
  }

  keyByPublicKey(pub: PublicKey): bigint | undefined {
    for (let [key, v] of this.dataStore.entries()) {
      if (v.publicKey.equals(pub).toBoolean()) return key;
    }
    return undefined;
  }
}