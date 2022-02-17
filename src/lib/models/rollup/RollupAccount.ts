import { CircuitValue, Field, prop, PublicKey, UInt32, UInt64 } from 'snarkyjs';

export default class RollupAccount extends CircuitValue {
  @prop balance: UInt64;
  @prop nonce: UInt32;
  @prop publicKey: PublicKey;

  constructor(balance: UInt64, publicKey: PublicKey, nonce: UInt32) {
    super();
    this.balance = balance;
    this.publicKey = publicKey;
    this.nonce = nonce;
  }
}
