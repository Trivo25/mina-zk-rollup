import {
  CircuitValue,
  Field,
  Poseidon,
  prop,
  PublicKey,
  Signature,
  UInt64,
} from 'snarkyjs';

/**
 * A {@link RollupDeposit} describes the action when a user wants to deposit funds to the layer 2.
 */
export default class RollupDeposit extends CircuitValue {
  @prop publicKey: PublicKey;
  @prop amount: UInt64;
  @prop tokenId: UInt64;
  @prop signature: Signature;

  constructor(
    publicKey: PublicKey,
    amount: UInt64,
    tokenId: UInt64,
    signature: Signature
  ) {
    super(publicKey, amount, tokenId, signature);
    this.publicKey = publicKey;
    this.amount = amount;
    this.tokenId = tokenId;
    this.signature = signature;
  }

  toFields(): Field[] {
    return this.amount
      .toFields()
      .concat(this.publicKey.toFields())
      .concat(this.tokenId.toFields());
  }

  getHash(): Field {
    return Poseidon.hash(this.toFields());
  }
}
