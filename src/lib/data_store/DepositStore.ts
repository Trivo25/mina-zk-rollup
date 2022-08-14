import { PublicKey } from 'snarkyjs';
import { RollupDeposit } from '../../rollup_operator/proof_system';
import KeyedDataStore from './KeyedDataStore';
import Config from '../../config/config';

export default class DepositStore extends KeyedDataStore<RollupDeposit> {
  constructor() {
    super(Config.depositHeight);
  }

  keyByPublicKey(pub: PublicKey): bigint | undefined {
    for (let [key, v] of this.dataStore.entries()) {
      if (v.publicKey.equals(pub).toBoolean()) return key;
    }
    return undefined;
  }
}
