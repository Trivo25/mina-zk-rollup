import { CircuitValue, Field, prop } from 'snarkyjs';
import { ISerializableField, IDeserializableField } from '../../../lib/models';

/**
 * The {@link RollupState} descibes the current state of the layer 2.
 * It currently includes the merkle root of all accounts that exist on the layer 2
 * and the merkle root of all pending deposits.
 */
export default class RollupState
  extends CircuitValue
  implements ISerializableField, IDeserializableField<RollupState>
{
  @prop pendingDepositsCommitment: Field;
  @prop accountDbCommitment: Field;
  constructor(p: Field, c: Field) {
    super();
    this.pendingDepositsCommitment = p;
    this.accountDbCommitment = c;
  }
  deserialize(xs: Field[]): RollupState {
    throw new Error('Method not implemented.');
  }
  serialize(): Field[] {
    throw new Error('Method not implemented.');
  }
}
