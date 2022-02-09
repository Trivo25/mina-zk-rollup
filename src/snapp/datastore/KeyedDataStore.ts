import { Field, CircuitValue, Poseidon } from 'snarkyjs';

import { MerklePathElement, MerkleStore } from './MerkleTree.js';

// NOTE should the key also be Hashable or only the value?
export class KeyedDataStore<K, V extends CircuitValue> {
  dataStore: Map<K, V>;
  merkleTree: MerkleStore | undefined;

  constructor() {
    this.dataStore = new Map<K, V>();
    this.merkleTree = undefined;
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
    this.merkleTree.makeTree();
    return true;
  }

  validateProof(
    merklePath: MerklePathElement[],
    targetHash: Field,
    merkleRoot: Field
  ): boolean {
    if (this.merkleTree === undefined) {
      return false;
    }
    return MerkleStore.validateProof(merklePath, targetHash, merkleRoot);
  }

  getMerkleRoot(): Field | undefined {
    if (this.merkleTree === undefined) {
      return undefined;
    }
    return this.merkleTree.getMerkleRoot();
  }

  getProof(value: V): MerklePathElement[] {
    if (this.merkleTree === undefined) {
      return [];
    }
    let index = this.merkleTree.getIndex(Poseidon.hash(value.toFields()));
    console.log(index);
    if (index === undefined) {
      return [];
    }
    return this.merkleTree.getProof(index);
  }

  get(key: K): V | undefined {
    return this.dataStore.get(key);
  }

  set(key: K, value: V): boolean {
    // TODO: update merkle tree
    if (this.merkleTree === undefined) {
      return false;
    }

    let index = this.merkleTree.getIndex(Poseidon.hash(value.toFields()));
    if (index !== undefined) {
      // element already exists in merkle tree
      let leaves = this.merkleTree.tree.leaves;
      leaves.splice(index, 1);

      leaves.push(Poseidon.hash(value.toFields()));
      this.merkleTree.clear();
      this.merkleTree.addLeaves(leaves);
      // rebuilds the tree
      this.merkleTree.makeTree();
    } else {
      // element doesnt exist already, need to be created
      this.merkleTree.addLeaves([Poseidon.hash(value.toFields())]);
      // rebuilds the tree
      this.merkleTree.makeTree();
    }

    return true;
  }
}
