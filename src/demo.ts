import * as assert from 'assert';
import { isReady, Poseidon, Field, shutdown, Bool } from 'snarkyjs';

import { MerkleStore, Tree } from './snapp/datastore/MerkleTree.js';

// for debugging purposes
test();
async function test() {
  await isReady;
  let m = new MerkleStore();

  let nodeData = [Field(0), Field(1), Field(2), Field(3), Field(4)];

  let h_A = Poseidon.hash([nodeData[0]]);
  let h_B = Poseidon.hash([nodeData[1]]);
  let h_C = Poseidon.hash([nodeData[2]]);
  let h_D = Poseidon.hash([nodeData[3]]);
  let h_E = Poseidon.hash([nodeData[4]]);

  let h_AB = Poseidon.hash([h_A, h_B]);
  let h_CD = Poseidon.hash([h_C, h_D]);

  let h_CABCD = Poseidon.hash([h_AB, h_CD]);

  let expectedMerkleRoot = Poseidon.hash([h_CABCD, h_E]);
  m.addLeaves(nodeData);
  m.makeTree();

  // m.printTree();

  let actualMerkleRoot = m.getMerkleRoot();
  if (actualMerkleRoot != undefined) {
    console.log('expecting correct root generation');
    console.log(
      'matching?',
      actualMerkleRoot.equals(expectedMerkleRoot).toBoolean()
    );

    let path = m.getProof(0);
    // m.printTree();
    // console.log('---------------');
    // console.log(path[0].right.toString());
    // console.log(path[1].right.toString());
    // console.log(path[2].right.toString());
    // console.log('from: ');
    // console.log(h_A.toString());
    let isValid = m.validateProof(path, h_A, expectedMerkleRoot);

    console.log('should find correct path to root');
    console.log('valid?', isValid);
  }

  //merkleTreeDemo();

  shutdown();
}

// function merkleTreeDemo() {
// let nodeData = [Field(0), Field(1), Field(2), Field(3)];
// let branchA = Poseidon.hash([
//   Poseidon.hash([Field(0)]),
//   Poseidon.hash([Field(1)]),
// ]);
// let branchB = Poseidon.hash([
//   Poseidon.hash([Field(2)]),
//   Poseidon.hash([Field(3)]),
// ]);
// let root = Poseidon.hash([branchA, branchB]);
//   let merkleTree = MerkleTreeFactory.treeFromList(nodeData);

//   assert.strictEqual(
//     root.toString(),
//     merkleTree.getHash().toString(),
//     'Expected merkle root does not match actual merkle root'
//   );

//   merkleTree.dataBlobs.map((el) => {
//     console.log(el.toString());
//   });
// }
