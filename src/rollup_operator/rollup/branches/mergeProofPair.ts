import { RollupProof, RollupStateTransition } from '../.';

export default function mergeProofPair(
  first: RollupProof,
  second: RollupProof
): RollupProof {
  first.publicInput.target.assertEquals(second.publicInput.source);
  return new RollupProof(
    new RollupStateTransition(
      first.publicInput.source,
      second.publicInput.target
    )
  );
}
