import { CircuitValue, Field, Poseidon } from 'snarkyjs';

/*

basically a blockchain where elements are chained and hashed

*/
// eslint-disable-next-line no-unused-vars
export class MerkleStack<T> {
  constructor() {}

  static getCommitment<V extends CircuitValue>(v: V, oldCommitment: Field) {
    return Poseidon.hash(v.toFields().concat(oldCommitment));
  }
}
