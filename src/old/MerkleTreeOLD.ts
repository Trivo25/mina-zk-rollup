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

export class Node {
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

class MerkleTree extends Node {
  dataBlobs: Field[];

  constructor(
    left: Node | undefined,
    right: Node | undefined,
    hash: Field,
    dataBlobs: Field[]
  ) {
    super(left, right, hash);
    this.dataBlobs = dataBlobs;
  }
}
export class MerkleTreeFactory {
  /**
   * Creates and returns a new tree based on an list of data blobs
   * @param dataBlocks List of data blobs
   * @returns a Merkle tree
   */
  static treeFromList(dataBlobs: Field[]): MerkleTree {
    let childNodes: Node[] = [];

    dataBlobs.forEach((el) => {
      childNodes.push(new Node(undefined, undefined, Poseidon.hash([el])));
    });

    return this.buildTree(childNodes, dataBlobs);
  }

  /**
   * Builds the tree
   * @param children List of children hash Nodes
   * @returns a Merkle tree
   */
  static buildTree(children: Node[], dataBlobs: Field[]): MerkleTree {
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
    let rootNode: Node = children[0];
    return new MerkleTree(
      rootNode.left,
      rootNode.right,
      rootNode.hash,
      dataBlobs
    );
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
