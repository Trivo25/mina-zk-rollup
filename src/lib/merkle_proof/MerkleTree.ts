import { Circuit, Field, Poseidon } from 'snarkyjs';

export interface Tree {
  leaves: Field[];
  levels: Field[][];
}

/**
 * A MerklePathElement has the following structure:
 * direction: Field - Direction of the node, Field(0) for left, Field(1) for right
 * hash: Field - Hash of the node
 * With a list of MerklePathElements you can recreate the merkle root for a specific leaf
 */
export type MerklePathElement = {
  direction: Field;
  hash: Field;
};

export class MerkleTree {
  tree: Tree;
  constructor() {
    this.tree = {
      leaves: [],
      levels: [],
    };
  }

  /**
   * resets the tree
   */
  clear() {
    this.tree = {
      leaves: [],
      levels: [],
    };
  }

  /**
   * Static function that returns a Merkle Tree
   * @param {Field[]} dataArray data leaves
   * @param {boolean} hash if true elements in the array will be hased using Poseidon, if false they will be inserted directly
   * @return {MerkleStore} Merkle store
   */
  static fromDataLeaves(dataArray: Field[], hash = true): MerkleTree {
    let tree = new MerkleTree();

    tree.addLeaves(dataArray, hash);
    return tree;
  }

  /**
   * Adds the hashes of an array of data to an existing Merkle Tree
   * @param {Field[]} dataArray data leaves
   * @param {boolean} hash if true elements in the array will be hased using Poseidon, if false they will be inserted directly
   */
  addLeaves(dataArray: Field[], hash: boolean = true) {
    dataArray.forEach((value: Field) => {
      this.tree.leaves.push(hash ? Poseidon.hash([value]) : value);
    });
    this.makeTree();
  }

  /**
   * Finds the index of a given element
   * @param {number} element to find
   * @returns {number | undefined} index or undefined
   */
  getIndex(element: Field): number | undefined {
    let result = undefined;
    this.tree.leaves.forEach((el, i) => {
      console.log(el.toString());
      if (el.equals(element).toBoolean()) {
        result = i;
        return;
      }
    });

    return result;
  }

  /**
   * Builds the merkle tree based on pre-initialized leaves
   */
  makeTree() {
    let leafCount: number = this.tree.leaves.length;
    if (leafCount > 0) {
      // skip this whole process if there are no leaves added to the tree
      this.tree.levels = [];
      this.tree.levels.unshift(this.tree.leaves);
      while (this.tree.levels[0].length > 1) {
        this.tree.levels.unshift(this.calculateNextLevel());
      }
    }
  }

  /**
   * Returns the merkle proof
   * @returns {Field | undefined} Merkle root, if not undefined
   */
  getMerkleRoot(): Field | undefined {
    if (this.tree.levels.length === 0) {
      return undefined;
    }
    return this.tree.levels[0][0];
  }

  /**
   * Returns a merkle path of an element at a given index
   * @param {number} index of element
   * @returns {MerklePathElement[] | undefined} merkle path or undefined
   */
  getProof(index: number): MerklePathElement[] {
    let currentRowIndex: number = this.tree.levels.length - 1;
    if (index < 0 || index > this.tree.levels[currentRowIndex].length - 1) {
      return []; // the index it out of the bounds of the leaf array
    }

    let path: MerklePathElement[] = [];

    for (let x = currentRowIndex; x > 0; x--) {
      let currentLevelNodeCount: number = this.tree.levels[x].length;
      // skip if this is an odd end node
      if (
        index === currentLevelNodeCount - 1 &&
        currentLevelNodeCount % 2 === 1
      ) {
        index = Math.floor(index / 2);
        continue;
      }

      // determine the sibling for the current index and get its value
      let isRightNode: number = index % 2;
      let siblingIndex: number = isRightNode ? index - 1 : index + 1;

      let siblingPosition: Field = isRightNode ? Field(0) : Field(1);
      let siblingValue: Field = this.tree.levels[x][siblingIndex];

      let sibling: MerklePathElement = {
        direction: siblingPosition,
        hash: siblingValue,
      };

      path.push(sibling);

      index = Math.floor(index / 2); // set index to the parent index
    }

    return path;
  }

  /**
   * Static function to validate a merkle path
   * @param {MerklePathElement[]} merklePath Merkle path leading to the root
   * @param {Field} leafHash Hash of element that needs checking
   * @param {Field} merkleRoot Root of the merkle tree
   * @returns {boolean} true when the merkle path matches the merkle root
   */
  static validateProof(
    merklePath: MerklePathElement[],
    targetHash: Field,
    merkleRoot: Field
  ): boolean {
    // NOTE: can probably remove this?
    if (merklePath.length === 0) {
      return targetHash.equals(merkleRoot).toBoolean(); // no siblings, single item tree, so the hash should also be the root
    }

    var proofHash: Field = targetHash;
    for (let x = 0; x < merklePath.length; x++) {
      proofHash = Circuit.if(
        merklePath[x].direction.equals(Field(0)),
        Poseidon.hash([merklePath[x].hash, proofHash]),
        proofHash
      );
      proofHash = Circuit.if(
        merklePath[x].direction.equals(Field(1)),
        Poseidon.hash([proofHash, merklePath[x].hash]),
        proofHash
      );
    }

    return proofHash.equals(merkleRoot).toBoolean();
  }

  /**
   * Calculates new levels of the merkle tree structure, helper function
   * @returns {Field[]} Level of the merkle tree
   */
  private calculateNextLevel(): Field[] {
    let nodes: Field[] = [];
    let topLevel: Field[] = this.tree.levels[0];
    let topLevelCount: number = topLevel.length;
    for (let x = 0; x < topLevelCount; x += 2) {
      if (x + 1 <= topLevelCount - 1) {
        // concatenate and hash the pair, add to the next level array, doubleHash if requested
        nodes.push(Poseidon.hash([topLevel[x], topLevel[x + 1]]));
      } else {
        // this is an odd ending node, promote up to the next level by itself
        nodes.push(topLevel[x]);
      }
    }
    return nodes;
  }

  /**
   * FOR DEBBUGING: Prints each levels of the tree
   */
  printTree() {
    console.log('printing tree');
    console.log('-----------------------------------------');

    this.tree.levels.forEach((levels, index) => {
      console.log(`----LEVEL ${this.tree.levels.length - index}----`);
      levels.forEach((l) => {
        console.log(l.toString());
      });
    });

    console.log('-----------------------------------------');
  }
}
