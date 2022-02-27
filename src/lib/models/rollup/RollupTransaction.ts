import {
  CircuitValue,
  Field,
  Group,
  prop,
  PublicKey,
  UInt32,
  UInt64,
} from 'snarkyjs';

export default class RollupTransaction extends CircuitValue {
  @prop amount: UInt64;
  @prop nonce: UInt32;
  @prop sender: PublicKey;
  @prop receiver: PublicKey;

  constructor(
    amount: UInt64,
    nonce: UInt32,
    sender: PublicKey,
    receiver: PublicKey
  ) {
    super();
    this.amount = amount;
    this.nonce = nonce;
    this.sender = sender;
    this.receiver = receiver;
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
      receiver
    );
  }
}
