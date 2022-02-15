import { CircuitValue, Poseidon } from 'snarkyjs';
import { MerkleTree } from '../merkle_proof/MerkleTree.js';

export class DataStack<V extends CircuitValue> {
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
    this.merkleTree.addLeaves(leaves, false);
    return poppedElement;
  }

  push(value: V): number {
    this.merkleTree.addLeaves([Poseidon.hash(value.toFields())], false);

    return this.dataStore.push(value);
  }

  size(): number {
    return this.dataStore.length;
  }

  get(index: number): V | undefined {
    return this.dataStore[index];
  }

  // shift() {}

  // unshift() {}

  splice(start: number, deleteCount?: number | undefined) {
    this.merkleTree.tree.leaves.splice(start, deleteCount);
    this.merkleTree.makeTree();
    return this.dataStore.splice(start, deleteCount);
  }

  // forEach(callback: (v: V, index: number, array: V[]) => void) {
  //   this.dataStore.forEach(callback);

  //   // TODO: update merkle tree just in case
  // }

  getProof() {}
}
