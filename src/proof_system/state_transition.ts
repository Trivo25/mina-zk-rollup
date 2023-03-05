import { Field, Poseidon, Struct } from 'snarkyjs';
export { StateTransition, RollupState };

class RollupState extends Struct({
  pendingDepositsCommitment: Field,
  accountDbCommitment: Field,
}) {
  static hash(s: RollupState): Field {
    return Poseidon.hash(RollupState.toFields(s));
  }

  hash(): Field {
    return RollupState.hash(this);
  }
}

/**
 * A {@link RollupStateTransition} descibes the transition that takes place when
 * the rollup operator updates the current state of the the layer 2 by providing a series of
 * proofs that attest correct execution of transactions.
 */
class StateTransition extends Struct({
  source: RollupState,
  target: RollupState,
}) {
  static hash(s: StateTransition): Field {
    return Poseidon.hash(StateTransition.toFields(s));
  }

  hash(): Field {
    return StateTransition.hash(this);
  }
}
