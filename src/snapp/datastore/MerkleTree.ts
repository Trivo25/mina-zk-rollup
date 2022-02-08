import { Field, Poseidon } from 'snarkyjs';

// MAJOR TODO: rework everything with Field logic
export interface Tree {
  leaves: Field[];
  levels: Field[][];
}

export class MerkleTree {
  tree: Tree;
  constructor() {
    this.tree = {
      leaves: [],
      levels: [],
    };
  }

  addLeaves(valuesArray: Field[]) {
    valuesArray.forEach((value: Field) => {
      this.tree.leaves.push(Poseidon.hash([value]));
    });
  }

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

  // Returns the merkle root value for the tree
  getMerkleRoot(): Field | undefined {
    if (this.tree.levels.length === 0) {
      return undefined;
    }
    return this.tree.levels[0][0];
  }

  // Returns the proof for a leaf at the given index as an array of merkle siblings in hex format
  getProof(index: number): any | undefined {
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

  // Takes a proof array, a target hash value, and a merkle root
  // Checks the validity of the proof and return true or false
  validateProof(proof: any, targetHash: Field, merkleRoot: Field): boolean {
    if (proof.length === 0) {
      return targetHash.equals(merkleRoot).toBoolean(); // no siblings, single item tree, so the hash should also be the root
    }

    var proofHash: Field = targetHash;
    for (let x = 0; x < proof.length; x++) {
      if (proof[x].left) {
        // then the sibling is a left node
        proofHash = Poseidon.hash([proof[x].left, proofHash]);
      } else if (proof[x].right) {
        // then the sibling is a right node
        proofHash = Poseidon.hash([proofHash, proof[x].right]);
      } else {
        // no left or right designation exists, proof is invalid
        return false;
      }
    }

    return proofHash.equals(merkleRoot).toBoolean();
  }

  // Calculates the next level of node when building the merkle tree
  // These values are calcalated off of the current highest level, level 0 and will be prepended to the levels array
  calculateNextLevel() {
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
