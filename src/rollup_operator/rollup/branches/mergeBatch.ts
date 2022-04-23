import RollupProof from '../RollupProof';

export default function mergeBatch(batch: RollupProof[]): RollupProof {
  let mergedBatch: RollupProof[] = [];
  if (batch.length === 1) {
    return batch[0];
  }

  for (let i = 0; i < batch.length; i += 2) {
    if (i === batch.length && i % 2 === 0) {
      // uneven batch list, last element
      mergedBatch.push(batch[i]);
      continue;
    }
    let first = batch[i];
    let second = batch[i + 1];

    if (i + 1 >= batch.length) {
      mergedBatch.push(first);
    } else {
      let merged = RollupProof.mergeProofPair(first, second);
      mergedBatch.push(merged);
    }
  }

  return RollupProof.mergeBatch(mergedBatch);
}
