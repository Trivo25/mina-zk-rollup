import { Field, MerkleWitness, PublicKey } from 'snarkyjs';
import { RollupDeposit } from '../../proof_system/transaction';
import KeyedMemoryStore from './KeyedMemoryStore';

export { DepositStore, DepositWitness };

class DepositStore extends KeyedMemoryStore<RollupDeposit> {
  constructor() {
    super(8);
  }

  keyByPublicKey(pub: PublicKey): bigint | undefined {
    for (let [key, v] of this.entries()) {
      if (v.publicKey.equals(pub).toBoolean()) return key;
    }
    return undefined;
  }
}

class DepositWitness extends MerkleWitness(8) {
  static empty() {
    let w: any = [];
    for (let index = 0; index < 8 - 1; index++) {
      w.push({ isLeft: false, sibling: Field.zero });
    }
    return new DepositWitness(w);
  }
}
