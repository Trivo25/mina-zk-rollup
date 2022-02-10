import { Field, CircuitValue, Poseidon } from 'snarkyjs';

import { MerklePathElement, MerkleStore } from './MerkleTree.js';

// NOTE should the key also be Hashable or only the value?
export class KeyedDataStore<K, V extends CircuitValue> {
  // the merkle tree doesnt store the actual data, its only a layer ontop of the dataStore map

  dataStore: Map<K, V>;
  merkleTree: MerkleStore;

  constructor() {
    this.dataStore = new Map<K, V>();
    this.merkleTree = new MerkleStore();
  }

  fromData(dataBlobs: Map<K, V>): boolean {
    // this.merkleTree = MerkleTreeFactory.buildTree(dataBlobs.values);
    // if (this.merkleTree === undefined) {
    //   return false;
    // }

    this.merkleTree = new MerkleStore();

    let leaves: Field[] = [];
    for (let [key, value] of dataBlobs.entries()) {
      leaves.push(Poseidon.hash(value.toFields()));
    }
    this.merkleTree.addLeaves(leaves, false);
    this.dataStore = dataBlobs;
    return true;
  }

  validateProof(
    merklePath: MerklePathElement[],
    targetHash: Field,
    merkleRoot: Field
  ): boolean {
    return MerkleStore.validateProof(merklePath, targetHash, merkleRoot);
  }

  getMerkleRoot(): Field | undefined {
    return this.merkleTree.getMerkleRoot();
  }

  getProof(value: V): MerklePathElement[] {
    // TODO: get proof by key, by value
    console.log('hash', Poseidon.hash(value.toFields()).toString());
    let index: number | undefined = this.merkleTree.getIndex(
      Poseidon.hash(value.toFields())
    );
    console.log('index', index);
    if (index === undefined) {
      return [];
    }
    return this.merkleTree.getProof(index);
  }

  get(key: K): V | undefined {
    return this.dataStore.get(key);
  }

  set(key: K, value: V): boolean {
    let index = this.merkleTree.getIndex(Poseidon.hash(value.toFields()));
    if (index !== undefined) {
      // element already exists in merkle tree
      let leaves = this.merkleTree.tree.leaves;
      leaves.splice(index, 1);

      leaves.push(Poseidon.hash(value.toFields()));
      this.merkleTree.clear();
      this.merkleTree.addLeaves(leaves);
      // rebuilds the tree

      this.dataStore.delete(key);
      this.dataStore.set(key, value);
    } else {
      // element doesnt exist already, need to be created
      this.merkleTree.addLeaves([Poseidon.hash(value.toFields())]);
      this.dataStore.set(key, value);
    }

    return true;
  }
}
