import {
  branch,
  proofSystem,
  ProofWithInput,
  PublicKey,
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
    accountDb: KeyedDataStore<string, RollupAccount>
  ): RollupProof {
    console.log(1);
    s.verify(t.sender, t.toFields()).assertEquals(true);
    console.log(2);

    let stateBefore = new RollupState(
      pending.getMerkleRoot()!,
      accountDb.getMerkleRoot()!
    );
    console.log(3);

    let senderAccount = accountDb.get(t.sender.toJSON()!.toString());

    // ! TODO: DUMMY CODE - REMOVE
    if (senderAccount === undefined) {
      accountDb.set(
        t.sender.toJSON()!.toString(),
        new RollupAccount(
          UInt64.fromNumber(100),
          t.sender,
          UInt32.fromNumber(0)
        )
      );
      senderAccount = accountDb.get(t.sender.toJSON()!.toString());
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

    accountDb.set(t.sender.toJSON()!.toString(), senderAccount);

    let receiverAccount = accountDb.get(t.receiver.toJSON()!.toString());

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
