import { CircuitValue, Field, Poseidon, prop } from 'snarkyjs';
/**
 * The {@link RollupState} describes the current state of the layer 2.
 * It currently includes the merkle root of all accounts that exist on the layer 2
 * and the merkle root of all pending deposits.
 */
export default class RollupState extends CircuitValue {
  @prop pendingDepositsCommitment: Field;
  @prop accountDbCommitment: Field;
  constructor(p: Field, c: Field) {
    super();
    this.pendingDepositsCommitment = p;
    this.accountDbCommitment = c;
  }
  getHash(): Field {
    return Poseidon.hash(this.toFields());
  }
}
