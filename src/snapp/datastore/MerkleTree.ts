import { Bool, Circuit, Field, Poseidon } from 'snarkyjs';

// MAJOR TODO: rework everything with Field and Circuit compatibile logic
export interface Tree {
  leaves: Field[];
  levels: Field[][];
}

export class MerkleStore {
  tree: Tree;
  constructor() {
    this.tree = {
      leaves: [],
      levels: [],
    };
  }

  /**
   * Adds the hashes of an array of data
   * @param dataArray Data leafes
   */
  addLeaves(dataArray: Field[]) {
    dataArray.forEach((value: Field) => {
      this.tree.leaves.push(Poseidon.hash([value]));
    });
  }

  /**
   * Builds the merkle tree based on pre-initialized leafes
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
   * @returns Merkle root, if not undefined
   */
  getMerkleRoot(): Field | undefined {
    if (this.tree.levels.length === 0) {
      return undefined;
    }
    return this.tree.levels[0][0];
  }

  /**
   * Returns a merkle proof/path of an element at a given index
   * @param index of element
   * @returns merkle path or undefined
   */
  getProof(index: number): any | undefined {
    // ! TODO: re write proof structure in a circuit friendly way

    let currentRowIndex: number = this.tree.levels.length - 1;
    if (index < 0 || index > this.tree.levels[currentRowIndex].length - 1) {
      return undefined; // the index it out of the bounds of the leaf array
    }

    let proof: any = [];
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

      let sibling: any = {};
      // NOTE I wanted to do this with an Enum Direction.RIGHT, Direction.LEFT, but it didn't wanna let me do it
      let siblingPosition: string = isRightNode ? 'left' : 'right';
      let siblingValue: Field = this.tree.levels[x][siblingIndex];
      sibling[siblingPosition] = siblingValue;

      proof.push(sibling);

      index = Math.floor(index / 2); // set index to the parent index
    }

    return proof;
  }

  /**
   * NOTE: this should happen on-chain in a circuit
   * Validates a merkle proof
   * @param merklePath Merkle path leading to the root
   * @param leafHash Hash of element that needs validation
   * @param merkleRoot Root of the merkle tree
   * @returns true when the merkle path matches the merkle root
   */
  static validateProof(
    merklePath: any,
    targetHash: Field,
    merkleRoot: Field
  ): boolean {
    // ! TODO: re write proof validation in a circuit compatibile way

    if (merklePath.length === 0) {
      return targetHash.equals(merkleRoot).toBoolean(); // no siblings, single item tree, so the hash should also be the root
    }

    var proofHash: Field = targetHash;
    for (let x = 0; x < merklePath.length; x++) {
      if (merklePath[x].left) {
        // then the sibling is a left node
        proofHash = Poseidon.hash([merklePath[x].left, proofHash]);
      } else if (merklePath[x].right) {
        // then the sibling is a right node
        proofHash = Poseidon.hash([proofHash, merklePath[x].right]);
      } else {
        // no left or right designation exists, merklePath is invalid
        return false;
      }
    }

    return proofHash.equals(merkleRoot).toBoolean();
  }

  /**
   * Calculates new levels of the merkle tree structure, helper function
   * @returns Level of the merkle tree
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
   * Prints each levels of the tree
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
