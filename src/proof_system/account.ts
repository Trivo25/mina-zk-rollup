import {
  CircuitValue,
  prop,
  UInt64,
  UInt32,
  PublicKey,
  Field,
  Poseidon,
  Bool,
  Struct,
} from 'snarkyjs';
import { AccountWitness } from '../lib/data_store/AccountStore.js';
import { base58Encode } from '../lib/helpers/base58.js';
export { Account, AuthRequired, Tuple };

/**
 * An {@link Account} describes an account on the layer 2.
 * It's structure is divided into an "essential" part, and an "non-essential" part.
 * The essential part includes the most important properties an account has in order for it to be verified, this includes
 * `balance`, `nonce`, `publicKey` *soon more*
 * the non-essential part only includes some meta information or "nice-to-haves" like
 * `identifier` or `aliveSince`
 */
class Account extends CircuitValue {
  @prop balance: UInt64;
  @prop nonce: UInt32;
  @prop publicKey: PublicKey;
  @prop merkleProof: AccountWitness;

  address: string;

  constructor(
    balance: UInt64,
    nonce: UInt32,
    publicKey: PublicKey,
    merkleProof: AccountWitness
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

  clone(): Account {
    return new Account(
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

  static empty(): Account {
    return new Account(
      UInt64.from(0),
      UInt32.from(0),
      PublicKey.empty(),
      AccountWitness.empty()
    );
  }
}

type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

type AuthRequired = {
  constant: Bool;
  signatureNecessary: Bool;
  signatureSufficient: Bool;
};

class Account_ extends Struct({
  publicKey: PublicKey,
  nonce: UInt32,
  token: Field,
  tokenSymbol: String,
  zkappUri: String,
  zkappState: {} as Tuple<Field | null, 8>,
  receiptChainHash: Field,
  balance: { total: UInt64 },
  permissions: {
    editState: {} as AuthRequired,
    send: {} as AuthRequired,
    receive: {} as AuthRequired,
    setDelegate: {} as AuthRequired,
    setPermissions: {} as AuthRequired,
    setVerificationKey: {} as AuthRequired,
    setZkappUri: {} as AuthRequired,
    editSequenceState: {} as AuthRequired,
    setTokenSymbol: {} as AuthRequired,
    incrementNonce: {} as AuthRequired,
    setVotingFor: {} as AuthRequired,
  },
  delegateAccount: { publicKey: PublicKey },
  sequenceEvents: {} as Tuple<Field | null, 32>,
  verificationKey: { data: Field, hash: Field },
  provedState: Bool,
}) {}
