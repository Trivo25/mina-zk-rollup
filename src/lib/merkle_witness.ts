import { Field, MerkleWitness } from 'snarkyjs';
import Config from '../config.js';

export { AccountMerkleProof, DepositMerkleProof };

class AccountMerkleProof extends MerkleWitness(Config.ledgerHeight) {
  static empty() {
    let w: any = [];
    for (let index = 0; index < (Config.ledgerHeight ?? 8) - 1; index++) {
      w.push({ isLeft: false, sibling: Field.zero });
    }
    return new AccountMerkleProof(w);
  }
}

class DepositMerkleProof extends MerkleWitness(Config.depositHeight) {
  static empty() {
    let w: any = [];
    for (let index = 0; index < (Config.depositHeight ?? 8) - 1; index++) {
      w.push({ isLeft: false, sibling: Field.zero });
    }
    return new DepositMerkleProof(w);
  }
}
