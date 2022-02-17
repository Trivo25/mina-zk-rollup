import { CircuitValue, Field, prop } from 'snarkyjs';

import RollupState from './RollupState';

export default class RollupStateTransition extends CircuitValue {
  @prop source: RollupState;
  @prop target: RollupState;
  constructor(source: RollupState, target: RollupState) {
    super();
    this.source = source;
    this.target = target;
  }
}
