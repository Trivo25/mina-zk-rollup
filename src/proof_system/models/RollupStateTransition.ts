import { CircuitValue, Field, Poseidon, prop } from 'snarkyjs';

import { RollupState } from '../index.js';
/**
 * A {@link RollupStateTransition} descibes the transition that takes place when
 * the rollup operator updates the current state of the the layer 2 by providing a series of
 * proofs that attest correct execution of transactions.
 */
export default class RollupStateTransition extends CircuitValue {
  @prop source: RollupState;
  @prop target: RollupState;
  constructor(source: RollupState, target: RollupState) {
    super(source, target);
    this.source = source;
    this.target = target;
  }

  getHash(): Field {
    return Poseidon.hash(this.toFields());
  }
}
