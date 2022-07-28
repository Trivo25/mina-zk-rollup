import {
  CircuitValue,
  Field,
  Poseidon,
  prop,
  PublicKey,
  UInt32,
  UInt64,
} from 'snarkyjs';
import { base58Encode } from '../../../lib/helpers';

/**
 * A {@link RollupTransaction} describes the transactions that take place on the layer 2.
 */

export default class RollupTransaction extends CircuitValue {
  @prop amount: UInt64;
  @prop nonce: UInt32;
  @prop sender: PublicKey;
  @prop receiver: PublicKey;
  @prop tokenId: Field;

  constructor(
    amount: UInt64,
    nonce: UInt32,
    sender: PublicKey,
    receiver: PublicKey,
    tokenId: Field
  ) {
    super();
    this.amount = amount;
    this.nonce = nonce;
    this.sender = sender;
    this.receiver = receiver;
    this.tokenId = tokenId;
  }

  getHash(): Field {
    return Poseidon.hash(this.toFields());
  }

  getBase58Hash(): string {
    return base58Encode(this.getHash().toString());
  }
}
