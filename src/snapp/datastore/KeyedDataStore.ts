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

  getProofByKey(key: K): MerklePathElement[] {
    let value = this.dataStore.get(key);
    if (value === undefined) {
      return [];
    }

    return this.getProof(Poseidon.hash(value.toFields()));
  }

  getProofByValue(value: V): MerklePathElement[] {
    return this.getProof(Poseidon.hash(value.toFields()));
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

  getProof(hash: Field): MerklePathElement[] {
    let index: number | undefined = this.merkleTree.getIndex(hash);
    if (index === undefined) {
      return [];
    }
    return this.merkleTree.getProof(index);
  }
}
