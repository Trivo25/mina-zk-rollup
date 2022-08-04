import { RollupStateTransition } from './proof_system';
import { RollupStateTransitionProof } from './proof_system/prover';

export interface ContractInterface {
  submitProof: (
    stateTransition: RollupStateTransition,
    stateTransitionProof: RollupStateTransitionProof
  ) => void;
}
