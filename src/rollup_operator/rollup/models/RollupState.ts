import { CircuitValue, Field, prop } from 'snarkyjs';
import { ISerializable, IDeserializable } from '../../../lib/models';

/**
 * The {@link RollupState} descibes the current state of the layer 2.
 * It currently includes the merkle root of all accounts that exist on the layer 2
 * and the merkle root of all pending deposits.
 */
export default class RollupState
  extends CircuitValue
  implements ISerializable, IDeserializable
{
  @prop pendingDepositsCommitment: Field;
  @prop accountDbCommitment: Field;
  constructor(p: Field, c: Field) {
    super();
    this.pendingDepositsCommitment = p;
    this.accountDbCommitment = c;
  }
  deserialize(xs: Field[]): Object {
    throw new Error('Method not implemented.');
  }
  serialize(): Field[] {
    throw new Error('Method not implemented.');
  }
}
