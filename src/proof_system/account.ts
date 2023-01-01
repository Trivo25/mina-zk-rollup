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
import { Permission } from './permissions.js';
export { Account, Tuple };

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

let P = {
  constant: Bool,
  signatureNecessary: Bool,
  signatureSufficient: Bool,
};

let State = {
  isSome: Bool,
  value: Field,
};

const emptyState = () => ({
  isSome: Bool(false),
  value: Field(0),
});

class Account_ extends Struct({
  publicKey: PublicKey,
  tokenId: Field,
  nonce: UInt32,
  token: Field,
  tokenSymbol: String,
  zkappUri: String,
  inferredNonce: UInt32,
  zkappState: [State, State, State, State, State, State, State, State],
  receiptChainHash: Field,
  timing: {
    initialMinimumBalance: UInt64,
    cliffTime: UInt64,
    cliffAmount: UInt64,
    vestingPeriod: UInt64,
    vestingIncrement: UInt64,
  },
  balance: {
    liquid: UInt64,
    locked: UInt64,
    total: UInt64,
    stateHash: Field,
  },
  permissions: {
    editState: P,
    send: P,
    receive: P,
    setDelegate: P,
    setPermissions: P,
    setVerificationKey: P,
    setZkappUri: P,
    editSequenceState: P,
    setTokenSymbol: P,
    incrementNonce: P,
    setVotingFor: P,
  },
  epochDelegateAccount: PublicKey,
  delegateAccount: PublicKey,
  sequenceEvents: [Field, Field, Field, Field, Field, Field, Field, Field],
  verificationKey: { data: Field, hash: Field },
  provedState: Bool,
}) {
  static hash(a: Account_): Field {
    return Poseidon.hash(Account_.toFields(a));
  }

  static empty() {
    return new Account_({
      publicKey: PublicKey.empty(),
      tokenId: Field.zero,
      nonce: UInt32.zero,
      token: Field.zero,
      tokenSymbol: '',
      zkappUri: '',
      inferredNonce: UInt32.zero,
      zkappState: [
        emptyState(),
        emptyState(),
        emptyState(),
        emptyState(),
        emptyState(),
        emptyState(),
        emptyState(),
        emptyState(),
      ],
      receiptChainHash: Field.zero,
      timing: {
        initialMinimumBalance: UInt64.zero,
        cliffTime: UInt64.zero,
        cliffAmount: UInt64.zero,
        vestingPeriod: UInt64.zero,
        vestingIncrement: UInt64.zero,
      },
      balance: {
        liquid: UInt64.zero,
        locked: UInt64.zero,
        total: UInt64.zero,
        stateHash: Field.zero,
      },
      permissions: {
        editState: Permission.none(),
        send: Permission.none(),
        receive: Permission.none(),
        setDelegate: Permission.none(),
        setPermissions: Permission.none(),
        setVerificationKey: Permission.none(),
        setZkappUri: Permission.none(),
        editSequenceState: Permission.none(),
        setTokenSymbol: Permission.none(),
        incrementNonce: Permission.none(),
        setVotingFor: Permission.none(),
      },
      epochDelegateAccount: PublicKey.empty(),
      delegateAccount: PublicKey.empty(),
      sequenceEvents: new Array<Field>(8).fill(Field.zero),
      verificationKey: { data: Field.zero, hash: Field.zero },
      provedState: Bool(false),
    });
  }
}
