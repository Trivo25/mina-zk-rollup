import { Field, MerkleWitness, PublicKey } from 'snarkyjs';
import KeyedMemoryStore from './KeyedMemoryStore.js';
import { Account } from '../../proof_system/account.js';

export { AccountStore, AccountWitness };

class AccountStore extends KeyedMemoryStore<Account> {
  constructor() {
    super(255);
  }

  keyByPublicKey(pub: PublicKey): bigint | undefined {
    for (let [key, v] of this.entries()) {
      if (v.publicKey.equals(pub).toBoolean()) return key;
    }
    return undefined;
  }
}

class AccountWitness extends MerkleWitness(255) {
  static empty() {
    let w: any = [];
    for (let index = 0; index < 255 - 1; index++) {
      w.push({ isLeft: false, sibling: Field.zero });
    }
    return new AccountWitness(w);
  }
}
