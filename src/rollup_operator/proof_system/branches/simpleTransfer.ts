import { Field, Signature, UInt32, UInt64 } from 'snarkyjs';
import { base58Encode } from '../../../lib/helpers';
import { DataStack, KeyedDataStore } from '../../../lib/data_store';
import {
  RollupAccount,
  RollupDeposit,
  RollupState,
  RollupStateTransition,
  RollupTransaction,
  RollupProof,
} from '../.';

export default function simpleTransfer(
  t: RollupTransaction,
  s: Signature,
  pendingDeposits: DataStack<RollupDeposit>,
  accountDatabase: KeyedDataStore<string, RollupAccount>
): RollupProof {
  // verify correctness of the transaction
  s.verify(t.sender, t.toFields()).assertEquals(true);
  // store the current state
  let stateBefore = new RollupState(Field(0), accountDatabase.getMerkleRoot()!);

  // get both participants of the transaction
  let senderAccount: RollupAccount | undefined = accountDatabase.get(
    base58Encode(JSON.stringify(t.sender.toJSON()!))
  );

  // NOTE: what about if-statements within proofs? probably not good
  if (senderAccount === undefined) {
    throw new Error('Sender account does not exist');
  }

  let receiverAccount: RollupAccount | undefined = accountDatabase.get(
    base58Encode(JSON.stringify(t.receiver.toJSON()!))
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
  senderAccount.nonce.equals(t.nonce).assertEquals(true);

  // ! seems like UInt64.lt(e) is having issues with comparing... using if for now
  // sender must have enough funds
  //t.amount.lt(senderAccount.balance).assertEquals(true);
  if (
    parseInt(senderAccount.balance.toString()) < parseInt(t.amount.toString())
  ) {
    throw new Error('not enough funds');
  }

  senderAccount.balance = senderAccount.balance.sub(t.amount);
  senderAccount.nonce = senderAccount.nonce.add(1);

  // store the sender
  accountDatabase.set(
    base58Encode(JSON.stringify(t.sender.toJSON()!)),
    senderAccount
  );

  let fee = UInt64.fromNumber(1); //UInt64.fromNumber(minaToNano(0.1)); // ! Dummy fee of 0.1 MINA
  // add funds to receiver
  receiverAccount.balance = receiverAccount.balance.add(t.amount.sub(fee));

  // store receiver
  accountDatabase.set(
    base58Encode(JSON.stringify(t.receiver.toJSON()!)),
    receiverAccount
  );

  // get the updates state
  let stateAfter = new RollupState(Field(0), accountDatabase.getMerkleRoot()!);

  return new RollupProof(new RollupStateTransition(stateBefore, stateAfter));
}
