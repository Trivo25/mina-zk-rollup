import { Field, Poseidon, Signature, UInt32, UInt64 } from 'snarkyjs';
import { KeyedMerkleStore } from '../../../lib/data_store/KeyedDataStore';
import { MerkleStack } from '../../../lib/data_store/MerkleStack';
import RollupAccount from '../models/RollupAccount';
import RollupDeposit from '../models/RollupDeposit';
import RollupState from '../models/RollupState';
import RollupStateTransition from '../models/RollupStateTransition';
import RollupTransaction from '../models/RollupTransaction';
import RollupProof from '../RollupProof';

export function simpleTransfer(
  t: RollupTransaction,
  s: Signature,
  pendingDeposits: MerkleStack<RollupDeposit>,
  accountDatabase: KeyedMerkleStore<string, RollupAccount>
): RollupProof {
  // verify correctness of the transaction
  s.verify(t.sender, t.toFields()).assertEquals(true);

  // store the current state
  let stateBefore = new RollupState(Field(0), accountDatabase.getMerkleRoot()!);

  // get both participants of the transaction
  let senderAccount: RollupAccount | undefined = accountDatabase.get(
    Poseidon.hash(t.sender.toFields()).toString()
  );

  // NOTE: what about if-statements within proofs? probably not good
  if (senderAccount === undefined) {
    throw new Error('Sender account does not exist');
  }

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

  // deal with sender account
  // TODO: check if balance of sender account has enough to send
  senderAccount.nonce.equals(t.nonce);

  senderAccount.balance = senderAccount.balance.sub(100);
  senderAccount.nonce = senderAccount.nonce.add(1);

  // store the sender
  accountDatabase.set(
    Poseidon.hash(t.sender.toFields()).toString(),
    senderAccount
  );

  // add funds to receiver
  receiverAccount.balance = receiverAccount.balance.add(t.amount);

  // store receiver
  accountDatabase.set(
    Poseidon.hash(t.receiver.toFields()).toString(),
    receiverAccount
  );

  // get the updates state
  let stateAfter = new RollupState(Field(0), accountDatabase.getMerkleRoot()!);

  return new RollupProof(new RollupStateTransition(stateBefore, stateAfter));
}
