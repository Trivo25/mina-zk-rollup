import { Experimental, Field, SmartContract } from 'snarkyjs';
import { StateTransition } from './state_transition';

export { Prover };

function Prover(userContract: typeof SmartContract) {
  const ContractProof = userContract.Proof();

  const Prover = Experimental.ZkProgram({
    publicInput: StateTransition,

    methods: {
      proveTransactionBatch: {
        privateInputs: [ContractProof],

        method(publicInput: Field, p1: ContractProof) {
          p1.verify();
          publicInput.assertEquals(publicInput);
        },
      },
    },
  });

  let RollupStateTransitionProof_ = Experimental.ZkProgram.Proof(Prover);
  class RollupStateTransitionProof extends RollupStateTransitionProof_ {}

  return {
    Prover,
    ProofClass: RollupStateTransitionProof,
    PublicInputType: StateTransition,
  };
}
