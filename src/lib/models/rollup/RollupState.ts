import { CircuitValue, Field, prop } from 'snarkyjs';

export default class RollupState extends CircuitValue {
  @prop pendingDepositsCommitment: Field;
  @prop accountDbCommitment: Field;
  constructor(p: Field, c: Field) {
    super();
    this.pendingDepositsCommitment = p;
    this.accountDbCommitment = c;
  }

  // NOTE: there seems to be an issue with the default toFields() method ?
  toFields(): Field[] {
    return this.pendingDepositsCommitment
      .toFields()
      .concat(this.accountDbCommitment.toFields());
  }
}
