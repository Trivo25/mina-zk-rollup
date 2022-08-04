import { RollupStateTransition } from './proof_system';
import { RollupStateTransitionProof } from './proof_system/prover';

export interface BlockchainInterface {
  submitProof: (
    stateTransition: RollupStateTransition,
    stateTransitionProof: RollupStateTransitionProof
  ) => void;
}
