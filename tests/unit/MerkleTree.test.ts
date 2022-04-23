import { Field, isReady, Poseidon, shutdown } from 'snarkyjs';

import { MerkleTree } from '../../src/lib/merkle_proof';

describe('MerkleTree unit test', () => {
  let merkleTree: MerkleTree;

  beforeAll(async () => {
    await isReady;
  });

  afterAll(async () => {
    shutdown();
  });

  beforeEach(() => {
    merkleTree = new MerkleTree();
  });

  it('should construct and proof a merkle tree', () => {
    // TODO: cleanup tests
    // TODO: test more edge cases
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
    merkleTree.addLeaves(nodeData);

    let actualMerkleRoot = merkleTree.getMerkleRoot();

    expect(actualMerkleRoot?.equals(expectedMerkleRoot).toBoolean());

    nodeData.forEach((el, index) => {
      expect(
        MerkleTree.validateProof(
          merkleTree.getProof(index),
          Poseidon.hash([el]),
          actualMerkleRoot === undefined ? Field(0) : actualMerkleRoot
        )
      );
    });
  });
});
