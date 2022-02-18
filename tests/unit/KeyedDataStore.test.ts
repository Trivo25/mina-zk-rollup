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

  it('KeyedDataStore Field key', () => {
    // TODO: cleanup tests
    // TODO: test more edge cases
    let store = new KeyedDataStore<string, Account>();
    let dataLeaves = new Map<string, Account>();

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

  it('KeyedDataStore with Circuit types', () => {
    // TODO: cleanup tests
    // TODO: test more edge cases
    let store = new KeyedDataStore<Field, Account>();
    let dataLeaves = new Map<Field, Account>();

    let pubA = PrivateKey.random().toPublicKey();
    let accountA = new Account(UInt64.fromNumber(100), pubA);
    dataLeaves.set(Field(0), accountA);

    let pubB = PrivateKey.random().toPublicKey();
    let accountB = new Account(UInt64.fromNumber(100), pubB);
    dataLeaves.set(Field(1), accountB);

    let pubC = PrivateKey.random().toPublicKey();
    let accountC = new Account(UInt64.fromNumber(100), pubC);
    dataLeaves.set(Field(2), accountC);

    let pubCnew = PrivateKey.random().toPublicKey();
    let accountCnew = new Account(UInt64.fromNumber(100), pubCnew);
    dataLeaves.set(Field(2), accountCnew);

    let ok = store.fromData(dataLeaves);
    expect(ok);

    store.set(Field(2), accountCnew);

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

    expect(store.get(Field(0))?.equals(accountCnew).toBoolean());
    expect(store.get(Field(1))?.equals(accountB).toBoolean());
    expect(store.get(Field(2))?.equals(accountA).toBoolean());
    expect(store.get(Field(2))?.equals(accountC).toBoolean() === false);
  });
});
