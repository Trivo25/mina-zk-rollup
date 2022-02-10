import { CircuitValue, Poseidon } from 'snarkyjs';
import { MerkleTree } from './MerkleTree';

class DataStore<V extends CircuitValue> {
  dataStore: Array<V>;
  merkleTree: MerkleTree;

  constructor() {
    this.dataStore = new Array<V>();
    this.merkleTree = new MerkleTree();
  }

  pop(): V | undefined {
    let leaves = this.merkleTree.tree.leaves;
    let poppedElement = this.dataStore.pop();
    leaves.pop();
    this.merkleTree.clear();
    this.merkleTree.addLeaves(leaves);
    return poppedElement;
  }

  push(value: V): number {
    this.merkleTree.addLeaves(value.toFields(), true);

    return this.dataStore.push(value);
  }

  shift() {}

  unshift() {}

  splice() {}

  getProof() {}
}
