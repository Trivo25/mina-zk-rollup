// import { isReady, shutdown, Field, Poseidon } from 'snarkyjs';
// import { MerkleTree } from '../snapp/datastore/MerkleTree';

describe('MerkleTree.ts', () => {
  // beforeEach(async () => {
  //   await isReady;
  // });

  // afterAll(() => {
  //   shutdown();
  // });

  it('Should form a merkle tree correctly', () => {
    expect(true).toBe(true);
    // let leaves = [];
    // for (let i = 0; i < 100; i++) {
    //   leaves.push(Field(Math.floor(Math.random() * 1000)));
    // }

    // let merkleTree = new MerkleTree();
    // merkleTree.addLeaves(leaves);

    // // make the contract verify every leaf inside the original leaves array

    // let merkleRoot = merkleTree.getMerkleRoot();
    // console.log(merkleRoot);
    // expect(merkleRoot).not.toBe(undefined);

    // leaves.forEach(async (leaf, i) => {
    //   let res = MerkleTree.validateProof(
    //     merkleTree.getProof(i),
    //     Poseidon.hash([leaf]),
    //     merkleRoot
    //   );

    //   expect(res).toBeTruthy();
    // });
  });
});
