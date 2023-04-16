import {
  Struct,
  AccountUpdate,
  Field,
  PublicKey,
  Types,
  UInt32,
  UInt64,
  Signature,
} from 'snarkyjs';
import { ZkappCommandInput } from '../rollup_operator/controllers/generated/graphql_types';

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
  /*   feePayer: {
    body: {
      publicKey: PublicKey,
      fee: UInt64,
      validUntil: UInt32,
      nonce: UInt32,
    },
    authorization: Signature,
  }, */
  accountUpdates: [AccountUpdate, AccountUpdate],
  memo: String,
  status: String,
}) {
  static fromZkAppCommand(x: ZkappCommandInput) {
    return new Transaction({
      accountUpdates: x.accountUpdates.map((a) =>
        AccountUpdate.fromJSON(a as Types.Json.AccountUpdate)
      ),
      memo: x.memo,
      status: '',
    });
  }
}
