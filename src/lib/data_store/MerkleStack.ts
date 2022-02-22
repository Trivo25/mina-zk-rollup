import { CircuitValue, Field, Poseidon } from 'snarkyjs';

/*

basically a blockchain where elements are chained and hashed

*/
export class MerkleStack<V extends CircuitValue> {
  constructor() {}

  getCommitment(v: V, oldCommitment: Field) {
    return Poseidon.hash(v.toFields().concat(oldCommitment));
  }
}
