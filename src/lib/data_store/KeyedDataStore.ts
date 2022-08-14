import { Field, CircuitValue, Poseidon } from 'snarkyjs';
import { MerkleTree, AccountMerkleProof } from '../merkle_proof';
export default class KeyedDataStore<V extends CircuitValue> {
  dataStore: Map<bigint, V>;
  merkleTree: MerkleTree;

  constructor(public readonly height: number) {
    this.dataStore = new Map<bigint, V>();
    this.merkleTree = new MerkleTree(height);
  }

  /**
   * Gets the merkle root of the current structure
   * @returns Merkle root or undefined if not found
   */
  getMerkleRoot(): Field {
    return this.merkleTree.getRoot();
  }

  /**
   * Returns the proof corresponding to value at a given key
   * @param key Key of the element in the map
   * @returns Merkle path
   */
  getProof(key: bigint): AccountMerkleProof {
    return new AccountMerkleProof(this.merkleTree.getWitness(key));
  }

  /**
   * Gets a value by its key
   * @param key
   * @returns value or undefined if not found
   */
  get(key: bigint): V | undefined {
    return this.dataStore.get(key);
  }

  /**
   * Sets or adds a new value and key to the data store
   * @param key Key
   * @param value Value
   * @returns true if successful
   */
  set(key: bigint, value: V) {
    this.dataStore.set(key, value);
    this.merkleTree.setLeaf(key, Poseidon.hash(value.toFields()));
  }

  keyByValue(value: V): bigint | undefined {
    let value_ = Poseidon.hash(value.toFields());
    for (let [key, v] of this.dataStore.entries()) {
      if (Poseidon.hash(v.toFields()).equals(value_).toBoolean()) return key;
    }
    return undefined;
  }
}
