import { KeyedDataStore } from '../../../lib/data_store';
import { RollupTransaction, RollupAccount } from '..';

export const applyTransition = (
  tx: RollupTransaction,
  store: KeyedDataStore<string, RollupAccount>
): RollupTransaction => {
  let senderAddr = tx.from.toBase58();
  let receiverAddr = tx.to.toBase58();

  let sender = store.get(senderAddr)!.clone();
  let receiver = store.get(receiverAddr)!.clone();

  tx.from.assertEquals(sender.publicKey);
  tx.signature.verify(sender!.publicKey, tx.toFields()).assertTrue();

  tx.sender = sender.clone();
  tx.receiver = receiver.clone();

  tx.sender!.merkleProof = store.getProofByKey(senderAddr);

  tx.amount.assertLte(tx.sender.balance);
  tx.nonce.assertEquals(tx.sender.nonce);

  sender.balance = sender.balance.sub(tx.amount);
  sender.nonce = sender.nonce.add(1);
  // calculate updates to the state tree

  store.set(senderAddr, sender);

  // move over to the receiver
  tx.receiver!.merkleProof = store.getProofByKey(receiverAddr);

  // apply change to the receiver
  receiver.balance = receiver.balance.add(tx.amount);

  store.set(receiverAddr, receiver);

  //tx.sender = sender;
  //tx.receiver = receiver;
  return tx;
};
