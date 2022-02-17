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

export default class RollupDeposit extends CircuitValue {
  @prop publicKey: PublicKey;
  @prop amount: UInt64;
  constructor(publicKey: PublicKey, amount: UInt64) {
    super();
    this.publicKey = publicKey;
    this.amount = amount;
  }

  // NOTE: there seems to be an issue with the default toFields() method ?
  toFields(): Field[] {
    return this.amount.toFields().concat(this.publicKey.toFields());
  }
}
