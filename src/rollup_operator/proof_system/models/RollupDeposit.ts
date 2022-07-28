import { CircuitValue, Field, prop, PublicKey, UInt64 } from 'snarkyjs';

/**
 * A {@link RollupDeposit} descibes the action when a user wants to deposit funds to the layer 2.
 */
export default class RollupDeposit extends CircuitValue {
  @prop publicKey: PublicKey;
  @prop amount: UInt64;
  @prop tokenId: UInt64;
  constructor(publicKey: PublicKey, amount: UInt64, tokenId: UInt64) {
    super();
    this.publicKey = publicKey;
    this.amount = amount;
    this.tokenId = tokenId;
  }
  getHash(): Field {
    throw new Error('Method not implemented.');
  }
  serialize(): Field[] {
    throw new Error('Method not implemented.');
  }
  deserializeInto(xs: Field[]): RollupDeposit {
    throw new Error('Method not implemented.');
  }
}
