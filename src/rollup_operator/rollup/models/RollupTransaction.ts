import {
  CircuitValue,
  Field,
  Group,
  prop,
  PublicKey,
  UInt32,
  UInt64,
} from 'snarkyjs';

// ! dummy value
const DEFAULT_TOKEN_ID: Field = Field(0);

import { IDeserializableField, ISerializable } from '../../../lib/models';

/**
 * A {@link RollupTransaction} describes the transactions that take place on the layer 2.
 */
export default class RollupTransaction
  extends CircuitValue
  implements ISerializable, IDeserializableField<RollupTransaction>
{
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

  serialize(): Field[] {
    throw new Error('Method not implemented.');
  }

  deserialize(xs: Field[]): RollupTransaction {
    throw new Error('Method not implemented.');
  }

  /**
   * Deserializes an array of Field elements in string format into a RollupTransaction object
   * @param payload Field elements in string format
   * @returns RollupTransaction
   */
  static deserializePayload(payload: Field[]): RollupTransaction {
    let sender: PublicKey = new PublicKey(new Group(payload[2], payload[3]));
    let receiver: PublicKey = new PublicKey(new Group(payload[4], payload[5]));
    return new RollupTransaction(
      new UInt64(payload[0]),
      new UInt32(payload[1]),
      sender,
      receiver,
      DEFAULT_TOKEN_ID
    );
  }
}
