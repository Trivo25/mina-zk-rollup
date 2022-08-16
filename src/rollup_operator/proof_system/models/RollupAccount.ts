import {
  Bool,
  CircuitValue,
  Field,
  Poseidon,
  prop,
  PublicKey,
  UInt32,
  UInt64,
} from 'snarkyjs';
import { base58Encode } from '../../../lib/helpers';

import { AccountMerkleProof } from '../../../lib/merkle_proof';

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
  @prop merkleProof: AccountMerkleProof;

  address: string;

  constructor(
    balance: UInt64,
    nonce: UInt32,
    publicKey: PublicKey,
    merkleProof: AccountMerkleProof
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

  getBase58Hash(): string {
    return base58Encode(this.getHash().toString());
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

  isEmpty(): Bool {
    return this.publicKey
      .equals(PublicKey.empty())
      .and(this.balance.equals(UInt64.from(0)))
      .and(this.nonce.equals(UInt32.from(0)));
  }

  static empty(): RollupAccount {
    return new RollupAccount(
      UInt64.from(0),
      UInt32.from(0),
      PublicKey.empty(),
      AccountMerkleProof.empty()
    );
  }
}
