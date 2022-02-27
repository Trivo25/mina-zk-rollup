import { CircuitValue, Field, Poseidon } from 'snarkyjs';

/*

basically a blockchain where elements are chained and hashed

*/
export class MerkleStack {
  constructor() {}

  static getCommitment<V extends CircuitValue>(v: V, oldCommitment: Field) {
    return Poseidon.hash(v.toFields().concat(oldCommitment));
  }
}
