import * as assert from 'assert';
import {
  isReady,
  Poseidon,
  Field,
  shutdown,
  Bool,
  UInt64,
  prop,
  PublicKey,
  PrivateKey,
  CircuitValue,
} from 'snarkyjs';

import { MerkleTree, Tree } from './lib/merkle_proof/MerkleTree';

import { KeyedMerkleStore } from './lib/data_store/KeyedMerkleStore';

import { MerkleStack } from './lib/data_store/MerkleStack';
import IPublicKey from './lib/models/interfaces/IPublicKey';

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

class Test {
  static t: number = 1;
}

// for debugging purposes
test();
async function test() {
  await isReady;

  let dataStore = new Map<IPublicKey, Test>();

  let acc = new Account(
    UInt64.fromNumber(10),
    PrivateKey.random().toPublicKey()
  );

  // dataStore.set(pubkey, acc);

  // console.log(dataStore.get(pubkey));

  // testF(dataStore);

  //dataStackDemo();
  //keyedDataStoreDemo();

  //merkleTreeDemo();
  let batch: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  let res = mergeBatch(batch);
  console.log(res);
  shutdown();
}

function mergeBatch(batch: string[]): string {
  let mergedBatch: string[] = [];

  if (batch.length === 1) {
    return batch[0];
  }
  for (let i = 0; i < batch.length; i += 2) {
    if (i === batch.length && i % 2 === 0) {
      // uneven batch list, last element
      mergedBatch.push(batch[i]);
      continue;
    }
    let first = batch[i];
    let second = batch[i + 1];

    if (i + 1 >= batch.length) {
      mergedBatch.push(first);
    } else {
      let merged = merge(first, second);
      mergedBatch.push(merged);
    }
  }

  return mergeBatch(mergedBatch);
}

function merge(a: string, b: string): string {
  console.log('merging');
  return '[' + a + b + ']';
}

function testF(store: Map<IPublicKey, Account>) {
  let pubkey: IPublicKey = {
    g: {
      x: '10403996635208384494000576583154508739074089553813316440641262781046658512525',
      y: '28475752123784524432200374217371603321225482732108015475742377080547605049403',
    },
  };
  console.log('inside func');
  console.log(store.get(pubkey));
}

function dataStackDemo() {
  let stack = new MerkleStack();
  stack.merkleTree.printTree();

  let a = PrivateKey.random().toPublicKey();
  let b = PrivateKey.random().toPublicKey();
  let c = PrivateKey.random().toPublicKey();

  stack.push(a);
  stack.push(b);
  stack.push(c);
  stack.merkleTree.printTree();
  stack.pop();
  stack.merkleTree.printTree();

  stack.dataStore.forEach((el) => {
    console.log(el);
  });
}

function keyedDataStoreDemo() {
  // dummy account

  let store = new KeyedMerkleStore<String, Account>();
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

  let accountD = new Account(
    UInt64.fromNumber(330),
    PrivateKey.random().toPublicKey()
  );
  // store.set('A', accountA);
  // store.set('B', accountB);
  store.set('C', accountC);
  // store.set('D', accountD);

  //store.set('C', accountCnew);
  console.log('ok?', ok);
  store.merkleTree.printTree();

  for (let [key, value] of store.dataStore) {
    console.log(key + ' ' + value.balance.toString());
  }

  let root = store.getMerkleRoot();
  if (root !== undefined) {
    console.log('root ', root.toString());

    console.log(
      'is member? ',
      store.validateProof(
        store.getProof(Poseidon.hash(accountA.toFields())),
        Poseidon.hash(accountA.toFields()),
        root
      )
    );

    console.log(
      'is member? ',
      store.validateProof(
        store.getProof(Poseidon.hash(accountB.toFields())),
        Poseidon.hash(accountB.toFields()),
        root
      )
    );

    console.log(
      'is member? ',
      store.validateProof(
        store.getProof(Poseidon.hash(accountC.toFields())),
        Poseidon.hash(accountC.toFields()),
        root
      )
    );

    console.log(
      'is member? ',
      store.validateProof(
        store.getProof(Poseidon.hash(accountCnew.toFields())),
        Poseidon.hash(accountCnew.toFields()),
        root
      )
    );
  }

  console.log('C ', store.get('C')?.equals(accountCnew).toBoolean());
  console.log('B ', store.get('B')?.equals(accountB).toBoolean());
  console.log('A ', store.get('A')?.equals(accountA).toBoolean());
  console.log('C not C_old', store.get('C')?.equals(accountC).toBoolean());
}

function merkleTreeDemo() {
  let m = new MerkleTree();
  let nodeData = [];

  for (let index = 0; index <= 4; index++) {
    nodeData.push(Field(Math.floor(Math.random() * 1000000000000)));
  }

  let h_A = Poseidon.hash([nodeData[0]]);
  let h_B = Poseidon.hash([nodeData[1]]);
  let h_C = Poseidon.hash([nodeData[2]]);
  let h_D = Poseidon.hash([nodeData[3]]);
  let h_E = Poseidon.hash([nodeData[4]]);

  let h_AB = Poseidon.hash([h_A, h_B]);
  let h_CD = Poseidon.hash([h_C, h_D]);

  let h_CABCD = Poseidon.hash([h_AB, h_CD]);

  let expectedMerkleRoot = Poseidon.hash([h_CABCD, h_E]);
  m.addLeaves(nodeData);

  let actualMerkleRoot = m.getMerkleRoot();
  if (actualMerkleRoot !== undefined) {
    console.log(
      'merkle root matching?',
      actualMerkleRoot.equals(expectedMerkleRoot).toBoolean()
    );
    let path = m.getProof(0);
    if (path) {
      path.forEach((p) => {
        console.log(p.direction.toString());
        console.log(p.hash.toString());
      });
    }

    console.log('Checking valid proof from all elements in the tree');
    nodeData.forEach((el, index) => {
      console.log(
        MerkleTree.validateProof(
          m.getProof(index),
          Poseidon.hash([el]),
          actualMerkleRoot === undefined ? Field(0) : actualMerkleRoot // TODO: fix
        )
      );
    });
  }
}
