export {};
// @proofSystem
// class RollupProof extends ProofWithInput<RollupStateTransition> {
//   @branch static processDeposit(
//     pending: MerkleStack<RollupDeposit>,
//     accountDb: AccountDb
//   ): RollupProof {
//     let before = new RollupState(pending.commitment, accountDb.commitment());
//     // let deposit = pending.pop();

//     // TODO: Apply deposit to db

//     let after = new RollupState(pending.commitment, accountDb.commitment());

//     return new RollupProof(new RollupStateTransition(before, after));
//   }

//   @branch static transaction(
//     t: RollupTransaction,
//     s: Signature,
//     pending: MerkleStack<RollupDeposit>,
//     accountDb: AccountDb
//   ): RollupProof {
//     s.verify(t.sender, t.toFields()).assertEquals(true);
//     let stateBefore = new RollupState(
//       pending.commitment,
//       accountDb.commitment()
//     );

//     let [senderAccount, senderPos] = accountDb.get(t.sender);
//     senderAccount.isSome.assertEquals(true);
//     senderAccount.value.nonce.assertEquals(t.nonce);

//     senderAccount.value.balance = senderAccount.value.balance.sub(t.amount);
//     senderAccount.value.nonce = senderAccount.value.nonce.add(1);

//     accountDb.set(senderPos, senderAccount.value);

//     let [receiverAccount, receiverPos] = accountDb.get(t.receiver);
//     receiverAccount.value.balance = receiverAccount.value.balance.add(t.amount);
//     accountDb.set(receiverPos, receiverAccount.value);

//     let stateAfter = new RollupState(
//       pending.commitment,
//       accountDb.commitment()
//     );
//     return new RollupProof(new RollupStateTransition(stateBefore, stateAfter));
//   }

//   // Is branch a good name?
//   @branch static merge(p1: RollupProof, p2: RollupProof): RollupProof {
//     p1.publicInput.target.assertEquals(p2.publicInput.source);
//     return new RollupProof(
//       new RollupStateTransition(p1.publicInput.source, p2.publicInput.target)
//     );
//   }
// }
