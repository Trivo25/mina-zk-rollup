import {
  Bool,
  Field,
  Poseidon,
  Signature,
  state,
  UInt32,
  UInt64,
} from 'snarkyjs';
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
  pendingDeposits: MerkleStack<RollupDeposit>,
  accountDatabase: KeyedMerkleStore<string, RollupAccount>
): RollupProof {
  s.verify(t.sender, t.toFields()).assertEquals(true);

  let stateBefore = new RollupState(
    pendingDeposits.getMerkleRoot()!,
    accountDatabase.getMerkleRoot()!
  );

  let senderAccount: RollupAccount | undefined = accountDatabase.get(
    Poseidon.hash(t.sender.toFields()).toString()
  );

  // NOTE: what about if-statements within proofs? probably not good
  if (senderAccount === undefined) {
    throw new Error('Sender account does not exist');
  }

  senderAccount.nonce.equals(t.nonce);

  senderAccount.balance = senderAccount.balance.sub(100);
  senderAccount.nonce = senderAccount.nonce.add(1);

  accountDatabase.set(
    Poseidon.hash(t.sender.toFields()).toString(),
    senderAccount
  );

  let receiverAccount: RollupAccount | undefined = accountDatabase.get(
    t.receiver.toJSON()!.toString()
  );

  // NOTE: what about if-statements within proofs? probably not good
  if (receiverAccount === undefined) {
    console.log('undefined receiver');
    receiverAccount = new RollupAccount(
      UInt64.fromNumber(0),
      t.receiver,
      UInt32.fromNumber(0)
    );
  }

  receiverAccount.balance = receiverAccount.balance.add(t.amount);

  accountDatabase.set(
    Poseidon.hash(t.receiver.toFields()).toString(),
    receiverAccount
  );

  let stateAfter = new RollupState(
    pendingDeposits.getMerkleRoot()!,
    accountDatabase.getMerkleRoot()!
  );

  return new RollupProof(new RollupStateTransition(stateBefore, stateAfter));
}
