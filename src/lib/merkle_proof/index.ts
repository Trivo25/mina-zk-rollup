import {
  MerkleTree,
  MerkleWitness,
  Witness,
  BaseMerkleWitness,
} from './MerkleTree';
import Config from '../../config/config';
import { Field } from 'snarkyjs';

export { MerkleTree, MerkleWitness, BaseMerkleWitness };

export class MerkleProof extends MerkleWitness(Config.ledgerHeight) {
  static empty() {
    let w: any = [];
    for (let index = 0; index < (Config.ledgerHeight ?? 8) - 1; index++) {
      w.push({ isLeft: false, sibling: Field.zero });
    }
    return new MerkleProof(w);
  }
}

export type { Witness };
