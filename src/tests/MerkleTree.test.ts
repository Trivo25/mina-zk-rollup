// import { isReady, shutdown, Field, Poseidon } from 'snarkyjs';
// import { MerkleStore } from '../snapp/datastore/MerkleTree';

// describe('MerkleTree.ts', () => {
//   beforeEach(async () => {
//     await isReady;
//   });

//   afterAll(() => {
//     shutdown();
//   });

//   it('Should form a merkle tree correctly', () => {
//     let m = new MerkleStore();

//     let nodeData = [Field(0), Field(1), Field(2), Field(3), Field(4)];

//     let h_A = Poseidon.hash([nodeData[0]]);
//     let h_B = Poseidon.hash([nodeData[1]]);
//     let h_C = Poseidon.hash([nodeData[2]]);
//     let h_D = Poseidon.hash([nodeData[3]]);
//     let h_E = Poseidon.hash([nodeData[4]]);

//     let h_AB = Poseidon.hash([h_A, h_B]);
//     let h_CD = Poseidon.hash([h_C, h_D]);

//     let h_CABCD = Poseidon.hash([h_AB, h_CD]);

//     let expectedMerkleRoot = Poseidon.hash([h_CABCD, h_E]);
//     m.addLeaves(nodeData);
//     m.makeTree();

//     let actualMerkleRoot = m.getMerkleRoot();

//     expect(actualMerkleRoot).toEqual(expectedMerkleRoot);

//     expect(
//       MerkleStore.validateProof(m.getProof(0), h_A, expectedMerkleRoot)
//     ).toEqual(true);
//     expect(
//       MerkleStore.validateProof(m.getProof(1), h_B, expectedMerkleRoot)
//     ).toEqual(true);
//     expect(
//       MerkleStore.validateProof(m.getProof(2), h_C, expectedMerkleRoot)
//     ).toEqual(true);
//     expect(
//       MerkleStore.validateProof(m.getProof(3), h_D, expectedMerkleRoot)
//     ).toEqual(true);
//     expect(
//       MerkleStore.validateProof(m.getProof(4), h_E, expectedMerkleRoot)
//     ).toEqual(true);
//   });
// });
