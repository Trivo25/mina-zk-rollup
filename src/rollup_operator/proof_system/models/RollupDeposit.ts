import {
  CircuitValue,
  Field,
  Poseidon,
  prop,
  PublicKey,
  Sign,
  Signature,
  UInt64,
} from 'snarkyjs';
import { base58Encode } from '../../../lib/helpers';
import { DepositMerkleProof } from '../../../lib/merkle_proof';
import { IDeposit } from '../../../lib/models';
import RollupAccount from './RollupAccount';

/**
 * A {@link RollupDeposit} describes the action when a user wants to deposit funds to the layer 2.
 */
export default class RollupDeposit extends CircuitValue {
  @prop publicKey: PublicKey;
  @prop to: PublicKey;
  @prop amount: UInt64;
  @prop tokenId: Field;
  @prop signature: Signature;

  @prop leafIndex: Field;
  @prop merkleProof: DepositMerkleProof;

  @prop target: RollupAccount;

  constructor(
    publicKey: PublicKey,
    to: PublicKey,
    amount: UInt64,
    tokenId: Field,
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
      .concat(this.tokenId.toFields())
      .concat(this.leafIndex.toFields());
  }

  getHash(): Field {
    return Poseidon.hash(this.toFields());
  }

  getBase58Hash(): string {
    return base58Encode(this.getHash().toString());
  }

  static from(
    publicKey: PublicKey,
    to: PublicKey,
    amount: UInt64,
    tokenId: Field,
    signature: Signature,
    leafIndex: Field,
    merkleProof: DepositMerkleProof,
    target: RollupAccount
  ) {
    return new RollupDeposit(
      publicKey,
      to,
      amount,
      tokenId,
      signature,
      leafIndex,
      merkleProof,
      target
    );
  }

  static fromInterface(d: IDeposit): RollupDeposit {
    try {
      return RollupDeposit.from(
        PublicKey.fromBase58(d.publicKey),
        PublicKey.fromBase58(d.to),
        UInt64.from(d.amount),
        Field.fromString(d.tokenId),
        Signature.fromJSON(d.signature)!,
        Field.fromString(d.index),
        DepositMerkleProof.empty(),
        RollupAccount.empty()
      );
    } catch (error: any) {
      throw new Error(
        `Cannot construct ${this.name} from invalid interface. ${error.message}`
      );
    }
  }
}
