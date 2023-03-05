import { Struct, FeePayer, AccountUpdate, Field, PublicKey } from 'snarkyjs';

export { Transaction, RollupDeposit };

class RollupDeposit extends Struct({
  publicKey: PublicKey,
}) {
  // workaround because we can not have static interface methods
  toFields(): Field[] {
    return RollupDeposit.toFields(this);
  }
}

class Transaction extends Struct({
  feePayer: {} as FeePayer,
  accountUpdates: [AccountUpdate, AccountUpdate],
  memo: String,
  status: String,
}) {}
