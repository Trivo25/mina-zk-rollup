import {
  CircuitValue,
  Field,
  Poseidon,
  prop,
  PublicKey,
  UInt32,
  UInt64,
} from 'snarkyjs';

import { MerkleProof } from '../../../lib/merkle_proof';

/**
 * A {@link RollupAccount} describes an account on the layer 2.
 * It's structure is divided into an "essential" part, and an "non-essential" part.
 * The essential part includes the most important properties an account has in order for it to be verified, this includes
 * `balance`, `nonce`, `publicKey` *soon more*
 * the non-essential part only includes some meta information or "nice-to-haves" like
 * `identifier` or `aliveSince`
 */
export default class RollupAccount extends CircuitValue {
  @prop balance: UInt64;
  @prop nonce: UInt32;
  @prop publicKey: PublicKey;
  @prop merkleProof: MerkleProof;

  address: string;

  constructor(
    balance: UInt64,
    nonce: UInt32,
    publicKey: PublicKey,
    merkleProof: MerkleProof
  ) {
    super(balance, nonce, publicKey, merkleProof);
    this.balance = balance;
    this.nonce = nonce;
    this.publicKey = publicKey;
    this.merkleProof = merkleProof;
    this.address = publicKey.toBase58();
  }

  getHash(): Field {
    // there are some things we might not want to hash e.g. die merkle path
    let preImage: Field[] = this.balance
      .toFields()
      .concat(this.nonce.toFields())
      .concat(this.publicKey.toFields());
    return Poseidon.hash(preImage);
  }

  toFields(): Field[] {
    return this.balance
      .toFields()
      .concat(this.nonce.toFields())
      .concat(this.publicKey.toFields());
  }

  clone(): RollupAccount {
    return new RollupAccount(
      this.balance,
      this.nonce,
      this.publicKey,
      this.merkleProof
    );
  }

  getAddress(): string {
    return this.publicKey.toBase58();
  }

  print() {
    console.log({
      balance: this.balance.toString(),
      nonce: this.nonce.toString(),
    });
  }
}
