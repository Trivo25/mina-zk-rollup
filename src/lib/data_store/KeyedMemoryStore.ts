import { CircuitValue, MerkleTree, Field, Poseidon } from 'snarkyjs';
import { AccountMerkleProof } from '../merkle_witness';

export default class KeyedDataStore<V extends CircuitValue> extends Map<
  bigint,
  V
> {
  merkleTree: MerkleTree;

  constructor(public readonly height: number) {
    super();
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
    return super.get(key);
  }

  /**
   * Sets or adds a new value and key to the data store
   * @param key Key
   * @param value Value
   * @returns true if successful
   */
  set(key: bigint, value: V): this {
    super.set(key, value);
    this.merkleTree.setLeaf(key, Poseidon.hash(value.toFields()));
    return this;
  }

  keyByValue(value: V): bigint | undefined {
    let value_ = Poseidon.hash(value.toFields());
    for (let [key, v] of this.entries()) {
      if (Poseidon.hash(v.toFields()).equals(value_).toBoolean()) return key;
    }
    return undefined;
  }
}
