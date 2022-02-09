import * as assert from 'assert';
import { isReady, Poseidon, Field, shutdown, Bool } from 'snarkyjs';

import { MerkleStore, Tree } from './snapp/datastore/MerkleTree.js';

// for debugging purposes
test();
async function test() {
  await isReady;
  let m = new MerkleStore();
  let nodeData = [];

  for (let index = 0; index <= 4; index++) {
    nodeData.push(Field(Math.floor(Math.random() * 1000000000000)));
  }

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

  let actualMerkleRoot = m.getMerkleRoot();
  if (actualMerkleRoot != undefined) {
    console.log(
      'merkle root matching?',
      actualMerkleRoot.equals(expectedMerkleRoot).toBoolean()
    );
    let path = m.getProof(0);
    if (path) {
      path.forEach((p) => {
        console.log(p.direction.toString());
        console.log(p.hash.toString());
      });
    }

    console.log('Checking valid proof from all elements in the tree');
    nodeData.forEach((el, index) => {
      console.log(
        MerkleStore.validateProof(
          m.getProof(index),
          Poseidon.hash([el]),
          expectedMerkleRoot
        )
      );
    });
  }

  //merkleTreeDemo();

  shutdown();
}
