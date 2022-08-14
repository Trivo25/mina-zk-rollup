import {
  MerkleTree,
  MerkleWitness,
  PATH_LENGTH,
  Witness,
  BaseMerkleWitness,
} from './MerkleTree';
import Config from '../../config/config';
import { Field } from 'snarkyjs';

export { MerkleTree, MerkleWitness, PATH_LENGTH, BaseMerkleWitness };

export class MerkleProof extends MerkleWitness(Config.ledgerHeight) {
  static empty() {
    let w: Witness = [];
    w.fill({ isLeft: false, sibling: Field.zero }, 0, Config.ledgerHeight);
    return new MerkleProof(w);
  }
}

export type { Witness };
