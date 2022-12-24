import Config from '../../config';
import { PublicKey } from 'snarkyjs';
import { RollupDeposit } from '../../proof_system/transaction';
import KeyedMemoryStore from './KeyedMemoryStore';

export default class DepositStore extends KeyedMemoryStore<RollupDeposit> {
  constructor() {
    super(Config.ledgerHeight);
  }

  keyByPublicKey(pub: PublicKey): bigint | undefined {
    for (let [key, v] of this.entries()) {
      if (v.publicKey.equals(pub).toBoolean()) return key;
    }
    return undefined;
  }

  count(): number {
    let n = 0;
    for (let [key, v] of this.entries()) {
      n++;
    }
    return n;
  }
}
