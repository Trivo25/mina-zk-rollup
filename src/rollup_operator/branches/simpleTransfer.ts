import { Signature, UInt32, UInt64 } from 'snarkyjs';
import { KeyedMerkleStore } from '../../lib/data_store/KeyedMerkleStore';
import { MerkleStack } from '../../lib/data_store/MerkleStack';
import RollupAccount from '../../lib/models/rollup/RollupAccount';
import RollupDeposit from '../../lib/models/rollup/RollupDeposit';
import RollupState from '../../lib/models/rollup/RollupState';
import RollupStateTransition from '../../lib/models/rollup/RollupStateTransition';
import RollupTransaction from '../../lib/models/rollup/RollupTransaction';
import RollupProof from './RollupProof';

export function simpleTransfer(
  t: RollupTransaction,
  s: Signature,
  pending: MerkleStack<RollupDeposit>,
  accountDb: KeyedMerkleStore<string, RollupAccount>
): RollupProof {
  // making sure the tx has actually been signed by the sender
  s.verify(t.sender, t.toFields()).assertEquals(true);

  let stateBefore = new RollupState(
    pending.getMerkleRoot()!,
    accountDb.getMerkleRoot()!
  );

  let senderAccount: RollupAccount | undefined = accountDb.get(
    t.sender.toJSON()!.toString()
  );

  // NOTE: what about if-statements within proofs? probably not good
  if (senderAccount === undefined) {
    throw new Error('Sender account does not exist');
  }

  senderAccount.balance.assertGt(t.amount);
  senderAccount.nonce.equals(t.nonce);

  senderAccount.balance = senderAccount.balance.sub(t.amount);
  senderAccount.nonce = senderAccount.nonce.add(1);

  accountDb.set(t.sender.toJSON()!.toString(), senderAccount);

  let receiverAccount: RollupAccount | undefined = accountDb.get(
    t.receiver.toJSON()!.toString()
  );

  // NOTE: what about if-statements within proofs? probably not good
  if (receiverAccount === undefined) {
    receiverAccount = new RollupAccount(
      UInt64.fromNumber(0),
      t.receiver,
      UInt32.fromNumber(0)
    );
  }

  receiverAccount.balance = receiverAccount.balance.add(t.amount);

  accountDb.set(t.receiver.toJSON()!.toString(), receiverAccount);

  let stateAfter = new RollupState(
    pending.getMerkleRoot()!,
    accountDb.getMerkleRoot()!
  );

  return new RollupProof(new RollupStateTransition(stateBefore, stateAfter));
}
