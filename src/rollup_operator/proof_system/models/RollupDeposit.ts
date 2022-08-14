import {
  CircuitValue,
  Field,
  Poseidon,
  prop,
  PublicKey,
  Signature,
  UInt64,
} from 'snarkyjs';
import { DepositMerkleProof } from '../../../lib/merkle_proof';
import RollupAccount from './RollupAccount';

/**
 * A {@link RollupDeposit} describes the action when a user wants to deposit funds to the layer 2.
 */
export default class RollupDeposit extends CircuitValue {
  @prop publicKey: PublicKey;
  @prop to: PublicKey;
  @prop amount: UInt64;
  @prop tokenId: UInt64;
  @prop signature: Signature;

  @prop leafIndex: Field;
  @prop merkleProof: DepositMerkleProof;

  @prop target: RollupAccount;

  constructor(
    publicKey: PublicKey,
    to: PublicKey,
    amount: UInt64,
    tokenId: UInt64,
    signature: Signature,
    leafIndex: Field,
    merkleProof: DepositMerkleProof,
    target: RollupAccount
  ) {
    super(publicKey, to, amount, tokenId, signature, merkleProof, target);
    this.publicKey = publicKey;
    this.to = to;
    this.amount = amount;
    this.tokenId = tokenId;
    this.signature = signature;
    this.leafIndex = leafIndex;
    this.merkleProof = merkleProof;
    this.target = target;
  }

  toFields(): Field[] {
    return this.amount
      .toFields()
      .concat(this.publicKey.toFields())
      .concat(this.to.toFields())
      .concat(this.tokenId.toFields());
  }

  getHash(): Field {
    return Poseidon.hash(this.toFields());
  }
}
