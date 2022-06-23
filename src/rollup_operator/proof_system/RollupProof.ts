import { branch, proofSystem, ProofWithInput, Signature } from 'snarkyjs';
import {
  RollupStateTransition,
  RollupTransaction,
  RollupDeposit,
  RollupAccount,
  mergeBatch,
  mergeProofPair,
  simpleTransfer,
} from '.';
import { DataStack, KeyedDataStore } from '../../lib/data_store';

@proofSystem
export default class RollupProof extends ProofWithInput<RollupStateTransition> {
  @branch
  static simpleTransfer(
    t: RollupTransaction,
    s: Signature,
    pendingDeposits: DataStack<RollupDeposit>,
    accountDatabase: KeyedDataStore<string, RollupAccount>
  ): RollupProof {
    return simpleTransfer(t, s, pendingDeposits, accountDatabase);
  }

  @branch
  static mergeBatch(batch: RollupProof[]): RollupProof {
    return mergeBatch(batch);
  }

  @branch
  static mergeProofPair(first: RollupProof, second: RollupProof): RollupProof {
    return mergeProofPair(first, second);
  }
}
