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

class Account extends CircuitValue {
  @prop balance: UInt64;
  @prop nonce: UInt32;
  @prop publicKey: PublicKey;

  constructor(balance: UInt64, publicKey: PublicKey, nonce: UInt32) {
    super();
    this.balance = balance;
    this.publicKey = publicKey;
    this.nonce = nonce;
  }

  // NOTE: there seems to be an issue with the default toFields() method ?
  toFields(): Field[] {
    return this.balance
      .toFields()
      .concat(this.publicKey.toFields())
      .concat(this.nonce.toFields());
  }
}
