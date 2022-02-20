import {
  branch,
  proofSystem,
  ProofWithInput,
  Signature,
  UInt32,
  UInt64,
} from 'snarkyjs';
import RollupState from '../../lib/models/rollup/RollupState';
import RollupStateTransition from '../../lib/models/rollup/RollupStateTransition';

import RollupTransaction from '../../lib/models/rollup/RollupTransaction';
import { MerkleStack } from '../../lib/data_store/MerkleStack';
import RollupDeposit from '../../lib/models/rollup/RollupDeposit';
import RollupAccount from '../../lib/models/rollup/RollupAccount';
import { KeyedMerkleStore } from '../../lib/data_store/KeyedMerkleStore';
import { simpleTransfer } from './simpleTransfer';

@proofSystem
class RollupProof extends ProofWithInput<RollupStateTransition> {
  @branch
  static simpleTransfer(
    t: RollupTransaction,
    s: Signature,
    pending: MerkleStack<RollupDeposit>,
    accountDb: KeyedMerkleStore<string, RollupAccount>
  ): RollupProof {
    return simpleTransfer(t, s, pending, accountDb);
  }

  @branch
  static mergeProofs(first: RollupProof, second: RollupProof): RollupProof {
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
