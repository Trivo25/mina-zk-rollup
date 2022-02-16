import {
  CircuitValue,
  Field,
  isReady,
  Poseidon,
  PrivateKey,
  prop,
  PublicKey,
  shutdown,
  UInt64,
} from 'snarkyjs';

import { KeyedDataStore } from '../../src/lib/data_store/KeyedDataStore';

// demo purposes
class Account extends CircuitValue {
  @prop balance: UInt64;
  @prop publicKey: PublicKey;

  constructor(balance: UInt64, publicKey: PublicKey) {
    super();
    this.balance = balance;
    this.publicKey = publicKey;
  }

  // NOTE: there seems to be an issue with the default toFields() method ?
  toFields(): Field[] {
    return this.balance.toFields().concat(this.publicKey.toFields());
  }
}

describe('KeyedDataStore', () => {
  beforeAll(async () => {
    await isReady;
  });

  afterAll(async () => {
    shutdown();
  });

  it('should construct KeyedDataStore', () => {
    // TODO: cleanup tests
    // TODO: test more edge cases
    let store = new KeyedDataStore<String, Account>();
    let dataLeaves = new Map<String, Account>();

    let accountA = new Account(
      UInt64.fromNumber(100),
      PrivateKey.random().toPublicKey()
    );
    dataLeaves.set('A', accountA);

    let accountB = new Account(
      UInt64.fromNumber(100),
      PrivateKey.random().toPublicKey()
    );
    dataLeaves.set('B', accountB);

    let accountC = new Account(
      UInt64.fromNumber(100),
      PrivateKey.random().toPublicKey()
    );
    dataLeaves.set('C', accountC);

    let accountCnew = new Account(
      UInt64.fromNumber(330),
      PrivateKey.random().toPublicKey()
    );

    let ok = store.fromData(dataLeaves);
    expect(ok);

    store.set('C', accountCnew);

    let root = store.getMerkleRoot();
    expect(root !== undefined);

    expect(
      store.validateProof(
        store.getProof(Poseidon.hash(accountA.toFields())),
        Poseidon.hash(accountA.toFields()),
        root === undefined ? Field(0) : root
      )
    );

    expect(
      store.validateProof(
        store.getProof(Poseidon.hash(accountB.toFields())),
        Poseidon.hash(accountB.toFields()),
        root === undefined ? Field(0) : root
      )
    );

    expect(
      store.validateProof(
        store.getProof(Poseidon.hash(accountCnew.toFields())),
        Poseidon.hash(accountCnew.toFields()),
        root === undefined ? Field(0) : root
      )
    );

    expect(
      store.validateProof(
        store.getProof(Poseidon.hash(accountC.toFields())),
        Poseidon.hash(accountC.toFields()),
        root === undefined ? Field(0) : root
      ) === false
    );

    expect(store.get('C')?.equals(accountCnew).toBoolean());
    expect(store.get('B')?.equals(accountB).toBoolean());
    expect(store.get('A')?.equals(accountA).toBoolean());
    expect(store.get('C')?.equals(accountC).toBoolean() === false);
  });
});
