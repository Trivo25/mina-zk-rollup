import { AccountStore } from '../../lib/data_store';
import { RollupTransaction } from '..';

export const applyTransitionSimulation = (
  tx: RollupTransaction,
  store: AccountStore
): RollupTransaction => {
  let senderIndex = store.keyByPublicKey(tx.from)!;
  let receiverIndex = store.keyByPublicKey(tx.to)!;

  let sender = store.get(senderIndex)!.clone();
  let receiver = store.get(receiverIndex)!.clone();

  tx.from.equals(tx.to).not();

  tx.from.assertEquals(sender.publicKey);
  tx.signature.verify(sender.publicKey, tx.toFields()).assertTrue();

  tx.amount.assertLte(sender.balance);
  tx.nonce.assertEquals(sender.nonce);

  tx.sender = sender.clone();
  tx.receiver = receiver.clone();

  tx.sender.merkleProof = store.getProof(senderIndex);

  sender.balance = sender.balance.sub(tx.amount);
  sender.nonce = sender.nonce.add(1);
  // calculate updates to the state tree

  store.set(senderIndex, sender);

  // move over to the receiver
  tx.receiver.merkleProof = store.getProof(receiverIndex);

  // apply change to the receiver
  receiver.balance = receiver.balance.add(tx.amount);

  store.set(receiverIndex, receiver);

  return tx;
};
