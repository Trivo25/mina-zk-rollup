import { Circuit, Field, Poseidon } from 'snarkyjs';
import { MerkleProof } from '../../../lib/merkle_proof';
import { PATH_LENGTH } from '../../../lib/merkle_proof/MerkleTree';
export const calculateMerkleRoot = (
  targetHash: Field,
  merkleProof: MerkleProof
): Field => {
  let proofHash: Field = targetHash;
  for (let x = 0; x < PATH_LENGTH; x++) {
    proofHash = Circuit.if(
      merkleProof.xs[x].direction.equals(Field(0)),
      Poseidon.hash([merkleProof.xs[x].hash, proofHash]),
      proofHash
    );
    proofHash = Circuit.if(
      merkleProof.xs[x].direction.equals(Field(1)),
      Poseidon.hash([proofHash, merkleProof.xs[x].hash]),
      proofHash
    );
  }

  return proofHash;
};
