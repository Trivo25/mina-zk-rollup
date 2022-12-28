import { Experimental, Field, SmartContract } from 'snarkyjs';
import { StateTransition } from './state_transition';

export { Prover };

function Prover(userContract: typeof SmartContract) {
  const ContractProof = userContract.Proof();

  const Prover = Experimental.ZkProgram({
    publicInput: Field,

    methods: {
      proveTransactionBatch: {
        privateInputs: [ContractProof],

        method(publicInput: Field, p1: InstanceType<typeof ContractProof>) {
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
