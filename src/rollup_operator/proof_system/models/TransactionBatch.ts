import { arrayProp, CircuitValue } from 'snarkyjs';
import RollupTransaction from './RollupTransaction';

const BATCH_SIZE = 5;

export default class TransactionBatch extends CircuitValue {
  @arrayProp(RollupTransaction, BATCH_SIZE) xs: RollupTransaction[];

  constructor(xs: RollupTransaction[]) {
    super(xs);
    this.xs = xs;
  }

  static fromElements(xs: RollupTransaction[]): TransactionBatch {
    if (xs.length > BATCH_SIZE) {
      throw Error(
        `Cannot process more than ${BATCH_SIZE} transactions in one batch.`
      );
    }
    return new TransactionBatch(xs);
  }
}
