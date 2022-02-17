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

type AccountDb = KeyedDataStore<PublicKey, RollupAccount>;

@proofSystem
class RollupProof extends ProofWithInput<RollupStateTransition> {
  @branch
  static transaction(
    t: RollupTransaction,
    s: Signature,
    pending: DataStack<RollupDeposit>,
    accountDb: AccountDb
  ): RollupProof {
    s.verify(t.sender, t.toFields()).assertEquals(true);

    let stateBefore = new RollupState(
      pending.getMerkleRoot()!,
      accountDb.getMerkleRoot()!
    );

    let senderAccount = accountDb.get(t.sender);

    if (senderAccount === undefined) {
      throw 'error'; // TODO: smarter assertion
    }

    //senderAccount.isSome.assertEquals(true);
    senderAccount.nonce.assertEquals(t.nonce);

    senderAccount.balance = senderAccount.balance.sub(t.amount);
    senderAccount.nonce = senderAccount.nonce.add(1);

    accountDb.set(t.sender, senderAccount);

    let receiverAccount = accountDb.get(t.receiver);

    if (receiverAccount === undefined) {
      receiverAccount = new RollupAccount(
        UInt64.fromNumber(0),
        t.receiver,
        UInt32.fromNumber(0)
      );
    }

    receiverAccount.balance = receiverAccount.balance.add(t.amount);
    accountDb.set(t.receiver, receiverAccount);

    let stateAfter = new RollupState(
      pending.getMerkleRoot()!,
      accountDb.getMerkleRoot()!
    );
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
