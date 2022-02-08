// TODO: remove
/* eslint-disable no-unused-vars */

import {
  Field,
  isReady,
  Poseidon,
  shutdown,
  CircuitValue,
  arrayProp,
} from 'snarkyjs';

export { Node, MerkleTreeFactory };

class Node {
  left: Node | undefined;
  right: Node | undefined;
  hash: Field;

  constructor(left: Node | undefined, right: Node | undefined, hash: Field) {
    this.left = left;
    this.right = right;
    this.hash = hash;
  }

  getLeft(): Node | undefined {
    return this.left;
  }

  setLeft(left: Node) {
    this.left = left;
  }

  getRight(): Node | undefined {
    return this.right;
  }

  setRight(right: Node) {
    this.right = right;
  }

  getHash(): Field {
    return this.hash;
  }

  setHash(hash: Field) {
    this.hash = hash;
  }

  print() {
    let root: Node = this;
    if (root === undefined || root === null) {
      return;
    }

    if (
      root.getLeft() === undefined ||
      (root.getLeft() === null && root.getRight() === undefined) ||
      root.getRight() === null
    ) {
      console.log(root.getHash().toString());
    }
    let queue: (Node | undefined)[] = [];
    queue.push(root);
    queue.push(undefined);

    while (queue.length !== 0) {
      let node: Node | undefined = queue.shift();
      if (node !== undefined) {
        console.log(node.getHash().toString());
      } else {
        if (queue.length !== 0) {
          console.log('---');
          queue.push(undefined);
        }
      }

      if (node !== undefined && node.getLeft() !== undefined) {
        queue.push(node.getLeft());
      }

      if (node !== undefined && node.getRight() !== undefined) {
        queue.push(node.getRight());
      }
    }
  }
}
class MerkleTreeFactory {
  /**
   * Creates and returns a new tree based on an list of data blobs
   * @param dataBlocks List of data blobs
   * @returns a Merkle tree
   */
  static treeFromList(dataBlocks: Field[]): Node {
    let childNodes: Node[] = [];

    dataBlocks.forEach((el) => {
      childNodes.push(new Node(undefined, undefined, Poseidon.hash([el])));
    });

    return this.buildTree(childNodes);
  }

  /**
   * Builds the tree
   * @param children List of children Node
   * @returns a Merkle tree
   */
  private static buildTree(children: Node[]): Node {
    let parents: Node[] = [];

    while (children.length != 1) {
      let index: number = 0;
      let length: number = children.length;
      while (index < length) {
        let leftChild: Node = children[index];
        let rightChild: Node;

        if (index + 1 < length) {
          rightChild = children[index + 1];
        } else {
          rightChild = new Node(undefined, undefined, leftChild.getHash());
        }

        let parentHash: Field = Poseidon.hash([
          leftChild.getHash(),
          rightChild.getHash(),
        ]);
        parents.push(new Node(leftChild, rightChild, parentHash));
        index += 2;
      }
      children = parents;
      parents = [];
    }
    return children[0];
  }
  /**
   * Checks if an element exists in a Merkle tree that leads to a root
   * @param index of element to proof
   * @param treeSize of the the tree
   * @param root merkle root
   * @param path path to the root
   * @returns true if element exists, false otherwise
   */
  static merkleProof(
    index: number,
    treeSize: number,
    root: Field,
    path: Field[]
  ): boolean {
    return true;
  }
}
// for debugging purposes
test();
async function test() {
  await isReady;
  let nodeData = [Field(0), Field(1), Field(2), Field(3)];
  let a = Poseidon.hash([Poseidon.hash([Field(0)]), Poseidon.hash([Field(1)])]);
  let b = Poseidon.hash([Poseidon.hash([Field(2)]), Poseidon.hash([Field(3)])]);
  let root = Poseidon.hash([a, b]);
  let t = MerkleTreeFactory.treeFromList(nodeData);
  // console.log(root.toString());
  // console.log(t.getHash().toString());
  t.print();

  shutdown();
}
