import { KeyedDataStore } from '../../../lib/data_store';
import { RollupTransaction, RollupAccount } from '..';

export const applyTransitionSimulation = (
  tx: RollupTransaction,
  store: KeyedDataStore<string, RollupAccount>
): RollupTransaction => {
  let senderAddr = tx.from.toBase58();
  let receiverAddr = tx.to.toBase58();

  let sender = store.get(senderAddr)!.clone();
  let receiver = store.get(receiverAddr)!.clone();

  tx.from.equals(tx.to).not();

  tx.from.assertEquals(sender.publicKey);
  tx.signature.verify(sender.publicKey, tx.toFields()).assertTrue();

  tx.amount.assertLte(sender.balance);
  tx.nonce.assertEquals(sender.nonce);

  tx.sender = sender.clone();
  tx.receiver = receiver.clone();

  tx.sender.merkleProof = store.getProofByKey(senderAddr);

  sender.balance = sender.balance.sub(tx.amount);
  sender.nonce = sender.nonce.add(1);
  // calculate updates to the state tree

  store.set(senderAddr, sender);

  // move over to the receiver
  tx.receiver.merkleProof = store.getProofByKey(receiverAddr);

  // apply change to the receiver
  receiver.balance = receiver.balance.add(tx.amount);

  store.set(receiverAddr, receiver);

  return tx;
};
