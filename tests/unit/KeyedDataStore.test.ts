import { assert, expect } from 'chai';
import { before, describe, it } from 'mocha';
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
  before(async () => {
    await isReady;
  });

  after(async () => {
    shutdown();
  });

  it('should construct KeyedDataStore', () => {
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
    dataLeaves.set('C', accountCnew);

    let ok = store.fromData(dataLeaves);
    assert(ok, "coudln't successfully build KeyedDataStore!");

    let accountD = new Account(
      UInt64.fromNumber(330),
      PrivateKey.random().toPublicKey()
    );
    // store.set('A', accountA);
    // store.set('B', accountB);
    console.log('HELLO');
    store.set('C', accountC);
    // store.set('D', accountD);

    //store.set('C', accountCnew);
    // store.merkleTree.printTree();

    // for (let [key, value] of store.dataStore) {
    //   console.log(key + ' ' + value.balance.toString());
    // }

    let root = store.getMerkleRoot();
    assert(root !== undefined, 'merkle root is undefiend!');
    // console.log('root ', root.toString());

    assert(
      store.validateProof(
        store.getProof(Poseidon.hash(accountA.toFields())),
        Poseidon.hash(accountA.toFields()),
        root === undefined ? Field(0) : root
      )
    );

    assert(
      store.validateProof(
        store.getProof(Poseidon.hash(accountB.toFields())),
        Poseidon.hash(accountB.toFields()),
        root === undefined ? Field(0) : root
      )
    );

    assert(
      store.validateProof(
        store.getProof(Poseidon.hash(accountC.toFields())),
        Poseidon.hash(accountC.toFields()),
        root === undefined ? Field(0) : root
      )
    );

    store.merkleTree.tree.leaves.forEach((el) => {
      console.log(el);
    });
    store.dataStore.forEach((el) => {
      console.log(el);
    });

    assert(store.get('C')?.equals(accountCnew).toBoolean() === false);
    assert(store.get('B')?.equals(accountB).toBoolean());
    assert(store.get('A')?.equals(accountA).toBoolean());
    assert(store.get('C')?.equals(accountC).toBoolean());
  });
});
