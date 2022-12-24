import Config from '../../config';
import { PublicKey } from 'snarkyjs';
import KeyedMemoryStore from './KeyedMemoryStore';
import { Account } from '../../proof_system/account';

export { AccountStore };

class AccountStore extends KeyedMemoryStore<Account> {
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
