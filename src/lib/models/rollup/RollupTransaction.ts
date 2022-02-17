import {
  CircuitValue,
  Field,
  isReady,
  Poseidon,
  PrivateKey,
  prop,
  PublicKey,
  shutdown,
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

  // NOTE: there seems to be an issue with the default toFields() method ?
  toFields(): Field[] {
    return this.amount
      .toFields()
      .concat(this.nonce.toFields())
      .concat(this.sender.toFields())
      .concat(this.receiver.toFields());
  }
}
