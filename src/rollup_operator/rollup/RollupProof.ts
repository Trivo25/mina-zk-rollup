import { branch, proofSystem, ProofWithInput, Signature } from 'snarkyjs';
import RollupStateTransition from './models/RollupStateTransition';
import RollupTransaction from './models/RollupTransaction';
import { MerkleStack } from '../../lib/data_store/DataStack';
import RollupDeposit from './models/RollupDeposit';
import RollupAccount from './models/RollupAccount';
import { KeyedMerkleStore } from '../../lib/data_store/KeyedDataStore';
import simpleTransfer from './branches/simpleTransfer';
import mergeBatch from './branches/mergeBatch';
import mergeProofPair from './branches/mergeProofPair';

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
    return mergeBatch(batch);
  }

  @branch
  static mergeProofPair(first: RollupProof, second: RollupProof): RollupProof {
    mergeProofPair(first, second);
  }
}

export default RollupProof;
