import {
  CircuitValue,
  Field,
  isReady,
  Poseidon,
  PrivateKey,
  prop,
  PublicKey,
  shutdown,
  UInt32,
  UInt64,
} from 'snarkyjs';

import { RollupState } from './RollupState';

class RollupStateTransition extends CircuitValue {
  @prop source: RollupState;
  @prop target: RollupState;
  constructor(source: RollupState, target: RollupState) {
    super();
    this.source = source;
    this.target = target;
  }

  // NOTE: there seems to be an issue with the default toFields() method ?
  toFields(): Field[] {
    return this.source.toFields().concat(this.target.toFields());
  }
}
