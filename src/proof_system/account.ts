import {
  UInt64,
  UInt32,
  PublicKey,
  Field,
  Poseidon,
  Bool,
  Struct,
} from 'snarkyjs';
import { Witness } from '../lib/data_store/KeyedMemoryStore.js';

import { Permission } from './permissions.js';
export { Account };
/* 
type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;
 */
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

class Account extends Struct({
  witness: Witness,
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
  static hash(a: Account): Field {
    return Poseidon.hash(Account.toFields(a));
  }

  hash(): Field {
    return Account.hash(this);
  }

  static empty() {
    return new Account({
      witness: Witness.empty(),
      publicKey: PublicKey.empty(),
      tokenId: Field.zero,
      nonce: UInt32.zero,
      token: Field.zero,
      tokenSymbol: '',
      zkappUri: '',
      inferredNonce: UInt32.zero,
      zkappState: new Array(8).fill(emptyState),
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
      sequenceEvents: new Array(8).fill(Field.zero),
      verificationKey: { data: Field.zero, hash: Field.zero },
      provedState: Bool(false),
    });
  }

  clone(): Account {
    throw Error('TODO');
  }

  // workaround because we can not have static interface methods
  toFields(): Field[] {
    return Account.toFields(this);
  }
}
