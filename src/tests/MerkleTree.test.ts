import { isReady, shutdown, Field, Poseidon } from 'snarkyjs';
import { MerkleTreeFactory } from '../snapp/merkle_tree/MerkleTree';

describe('MerkleTree.ts', () => {
  beforeEach(async () => {
    await isReady;
  });

  afterAll(() => {
    shutdown();
  });

  it('Should form a merkle tree correctly', () => {
    let nodeData = [Field(0), Field(1), Field(2), Field(3)];
    let a = Poseidon.hash([
      Poseidon.hash([Field(0)]),
      Poseidon.hash([Field(1)]),
    ]);
    let b = Poseidon.hash([
      Poseidon.hash([Field(2)]),
      Poseidon.hash([Field(3)]),
    ]);
    let root = Poseidon.hash([a, b]);
    let t = MerkleTreeFactory.treeFromList(nodeData);
    expect(root).toEqual(t.getHash());
  });
});
