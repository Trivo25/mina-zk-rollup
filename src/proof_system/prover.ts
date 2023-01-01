import { Experimental, SmartContract } from 'snarkyjs';
import { StateTransition } from './state_transition.js';

export { Prover };

function Prover(userContract: typeof SmartContract) {
  const ContractProof = userContract.Proof();

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
          publicInput.assertEquals(publicInput);
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
