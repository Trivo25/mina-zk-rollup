import {
  MerkleTree,
  MerkleWitness,
  Witness,
  BaseMerkleWitness,
} from './MerkleTree.js';
import Config from '../../config/config.js';
import { Field } from 'snarkyjs';

export { MerkleTree, MerkleWitness, BaseMerkleWitness };

export class AccountMerkleProof extends MerkleWitness(Config.ledgerHeight) {
  static empty() {
    let w: any = [];
    for (let index = 0; index < (Config.ledgerHeight ?? 8) - 1; index++) {
      w.push({ isLeft: false, sibling: Field.zero });
    }
    return new AccountMerkleProof(w);
  }
}

export class DepositMerkleProof extends MerkleWitness(Config.depositHeight) {
  static empty() {
    let w: any = [];
    for (let index = 0; index < (Config.depositHeight ?? 8) - 1; index++) {
      w.push({ isLeft: false, sibling: Field.zero });
    }
    return new DepositMerkleProof(w);
  }
}

export type { Witness };
