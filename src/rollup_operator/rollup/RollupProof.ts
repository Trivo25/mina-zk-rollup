import { branch, proofSystem, ProofWithInput, Signature } from 'snarkyjs';
import RollupStateTransition from './models/RollupStateTransition';
import RollupTransaction from './models/RollupTransaction';
import { MerkleStack } from '../../lib/data_store/DataStack';
import RollupDeposit from './models/RollupDeposit';
import RollupAccount from './models/RollupAccount';
import { KeyedMerkleStore } from '../../lib/data_store/KeyedDataStore';
import { simpleTransfer } from './branches/simpleTransfer';

@proofSystem
class RollupProof extends ProofWithInput<RollupStateTransition> {
  @branch
  static simpleTransfer(
    t: RollupTransaction,
    s: Signature,
    pendingDeposits: MerkleStack<RollupDeposit>,
    accountDatabase: KeyedMerkleStore<string, RollupAccount>
  ): RollupProof {
    return simpleTransfer(t, s, pendingDeposits, accountDatabase);
  }

  @branch
  static mergeBatch(batch: RollupProof[]): RollupProof {
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

  @branch
  static mergeProofPair(first: RollupProof, second: RollupProof): RollupProof {
    first.publicInput.target.assertEquals(second.publicInput.source);
    return new RollupProof(
      new RollupStateTransition(
        first.publicInput.source,
        second.publicInput.target
      )
    );
  }
}

export default RollupProof;
