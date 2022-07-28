import {
  CircuitValue,
  Field,
  Poseidon,
  prop,
  PublicKey,
  Signature,
  UInt32,
  UInt64,
} from 'snarkyjs';
import { base58Encode } from '../../../lib/helpers';
import { RollupAccount } from '../.';

/**
 * A {@link RollupTransaction} describes the transactions that take place on the layer 2.
 */

export default class RollupTransaction extends CircuitValue {
  @prop amount: UInt64;
  @prop nonce: UInt32;
  @prop sender: RollupAccount;
  @prop receiver: RollupAccount;
  @prop tokenId: Field;
  @prop signature: Signature;

  constructor(
    amount: UInt64,
    nonce: UInt32,
    sender: RollupAccount,
    receiver: RollupAccount,
    tokenId: Field,
    signature: Signature
  ) {
    super();
    this.amount = amount;
    this.nonce = nonce;
    this.sender = sender;
    this.receiver = receiver;
    this.tokenId = tokenId;
    this.signature = signature;
  }

  getHash(): Field {
    return Poseidon.hash(this.toFields());
  }

  getBase58Hash(): string {
    return base58Encode(this.getHash().toString());
  }
}
