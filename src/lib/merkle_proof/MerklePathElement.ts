import { Field } from 'snarkyjs';

/**
 * A MerklePathElement has the following structure:
 * direction: Field - Direction of the node, Field(0) for left, Field(1) for right
 * hash: Field - Hash of the node
 * With a list of MerklePathElements you can recreate the merkle root for a specific leaf
 */
export default interface MerklePathElement {
  direction: Field;
  hash: Field;
}
