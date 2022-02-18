import {
  branch,
  Field,
  Poseidon,
  proofSystem,
  ProofWithInput,
  Signature,
  UInt32,
  UInt64,
} from 'snarkyjs';
import RollupState from './RollupState';
import RollupStateTransition from './RollupStateTransition';

import RollupTransaction from './RollupTransaction';
import { DataStack } from '../../data_store/DataStack';
import RollupDeposit from './RollupDeposit';
import RollupAccount from './RollupAccount';
import { KeyedDataStore } from '../../data_store/KeyedDataStore';

@proofSystem
class RollupProof extends ProofWithInput<RollupStateTransition> {
  @branch
  static transaction(
    t: RollupTransaction,
    s: Signature,
    pending: DataStack<RollupDeposit>,
    accountDb: KeyedDataStore<Field, RollupAccount>
  ): RollupProof {
    console.log(1);
    s.verify(t.sender, t.toFields()).assertEquals(true);
    console.log(2);

    let stateBefore = new RollupState(
      pending.getMerkleRoot()!,
      accountDb.getMerkleRoot()!
    );

    console.log(accountDb.getMerkleRoot()?.toString());
    console.log(accountDb.get(Poseidon.hash([Field(0)])));
    console.log(3);

    let senderAccount = accountDb.get(Poseidon.hash(t.sender.toFields()));
    console.log(senderAccount);
    // ! TODO: DUMMY CODE - REMOVE
    if (senderAccount === undefined) {
      accountDb.set(
        Poseidon.hash(t.sender.toFields()),
        new RollupAccount(
          UInt64.fromNumber(100),
          t.sender,
          UInt32.fromNumber(0)
        )
      );
      senderAccount = accountDb.get(Poseidon.hash(t.sender.toFields()));
      console.log(senderAccount);
      if (senderAccount === undefined) {
        throw new Error('...');
      }
      // throw 'Sender does not exist in the ledger'; // TODO: smarter assertion
    }

    //senderAccount.isSome.assertEquals(true);
    senderAccount.nonce.assertEquals(t.nonce);
    senderAccount.balance.assertGt(t.amount);

    senderAccount.balance = senderAccount.balance.sub(t.amount);
    senderAccount.nonce = senderAccount.nonce.add(1);

    accountDb.set(Poseidon.hash(t.sender.toFields()), senderAccount);

    let receiverAccount = accountDb.get(Poseidon.hash(t.receiver.toFields()));

    if (receiverAccount === undefined) {
      receiverAccount = new RollupAccount(
        UInt64.fromNumber(0),
        t.receiver,
        UInt32.fromNumber(0)
      );
    }

    receiverAccount.balance = receiverAccount.balance.add(t.amount);
    accountDb.set(Poseidon.hash(t.receiver.toFields()), receiverAccount);

    let stateAfter = new RollupState(
      pending.getMerkleRoot()!,
      accountDb.getMerkleRoot()!
    );
    console.log(4);

    return new RollupProof(new RollupStateTransition(stateBefore, stateAfter));
  }

  @branch
  static mergeProofs(first: RollupProof, second: RollupProof): RollupProof {
    first.publicInput.target.assertEquals(second.publicInput.source);
    return new RollupProof(
      new RollupStateTransition(
        first.publicInput.source,
        second.publicInput.target
      )
    );
  }
}

export default RollupProof;
