import { Experimental, SmartContract } from 'snarkyjs';
import { StateTransition } from './state_transition.js';

export { Prover };

function Prover(userContract: typeof SmartContract) {
  const ContractProof = userContract.Proof();

  // this is the prover used to the prove the tx of the user contract
  // most of the tx logic still TBD and exists on different branches for now
  const RollupProver = Experimental.ZkProgram({
    publicInput: StateTransition,

    methods: {
      proveTransactionBatch: {
        privateInputs: [ContractProof],
        // @ts-ignore
        method(
          publicInput: StateTransition,
          p1: InstanceType<typeof ContractProof>
        ) {
          p1.verify();
          publicInput.hash().assertEquals(publicInput.hash());
        },
      },
    },
  });

  let RollupStateTransitionProof_ = Experimental.ZkProgram.Proof(RollupProver);
  class RollupStateTransitionProof extends RollupStateTransitionProof_ {}

  return {
    RollupProver,
    ProofClass: RollupStateTransitionProof,
    PublicInputType: StateTransition,
  };
}
