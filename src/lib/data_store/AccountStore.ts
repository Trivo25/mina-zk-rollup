import { PublicKey } from 'snarkyjs';
import { RollupAccount } from '../../proof_system';
import KeyedMemoryStore from './KeyedMemoryStore';
import Config from '../../config/config';

export default class AccountStore extends KeyedMemoryStore<RollupAccount> {
  constructor() {
    super(Config.ledgerHeight);
  }

  keyByPublicKey(pub: PublicKey): bigint | undefined {
    for (let [key, v] of this.entries()) {
      if (v.publicKey.equals(pub).toBoolean()) return key;
    }
    return undefined;
  }
}
