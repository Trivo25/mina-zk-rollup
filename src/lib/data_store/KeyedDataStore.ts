import { Field, Poseidon } from 'snarkyjs';
import { MerkleTree, AccountMerkleProof } from '../merkle_proof';
import { Level } from 'level';

import { AsFieldElements } from 'snarkyjs';

export default class KeyedDataStore<V> {
  objType: AsFieldElements<V>;

  merkleTree: MerkleTree;
  protected db: Level<string, any>;

  constructor(
    objType: AsFieldElements<V>,
    public readonly height: number,
    db: Level<string, any>
  ) {
    this.objType = objType;
    this.db = db;
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
  async get(key: bigint): Promise<V | undefined> {
    let payload = await this.db.get(key.toString());
    try {
      if (payload) {
        payload = this.objType.ofFields(
          JSON.parse(payload).map((f: string) => Field.fromString(f))
        );
      }
    } catch (error) {
      console.error(error);
      return undefined;
    }
    return payload;
  }

  /**
   * Sets or adds a new value and key to the data store
   * @param key Key
   * @param value Value
   * @returns true if successful
   */
  set(key: bigint, value: V): this {
    let fields = this.objType.toFields(value);

    this.db.put(key.toString(), JSON.stringify(fields));
    this.merkleTree.setLeaf(key, Poseidon.hash(fields));
    return this;
  }
}
