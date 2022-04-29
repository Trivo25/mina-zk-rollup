import { CircuitValue, Field, prop } from 'snarkyjs';

import { RollupState } from '../.';
import { ISerializableField, IDeserializableField } from '../../../lib/models';

/**
 * A {@link RollupStateTransition} descibes the transition that takes place when
 * the rollup operator updates the current state of the the layer 2 by providing a series of
 * proofs that attest correct execution of transactions.
 */
export default class RollupStateTransition
  extends CircuitValue
  implements ISerializableField, IDeserializableField<RollupStateTransition>
{
  @prop source: RollupState;
  @prop target: RollupState;
  constructor(source: RollupState, target: RollupState) {
    super();
    this.source = source;
    this.target = target;
  }
  deserialize(xs: Field[]): RollupStateTransition {
    throw new Error('Method not implemented.');
  }
  serialize(): Field[] {
    throw new Error('Method not implemented.');
  }
}
