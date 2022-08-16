import { arrayProp, CircuitValue } from 'snarkyjs';
import RollupTransaction from './RollupTransaction';
import Config from '../../../config/config';
import RollupDeposit from './RollupDeposit';
const BATCH_SIZE = Config.batchSize;

export default class TransactionBatch extends CircuitValue {
  @arrayProp(RollupDeposit, BATCH_SIZE)
  xs!: RollupDeposit[];

  static batchSize = BATCH_SIZE;

  constructor(xs: RollupDeposit[]) {
    super(xs);
  }

  static fromElements(xs: RollupDeposit[]): TransactionBatch {
    if (xs.length !== BATCH_SIZE) {
      throw Error(
        `Can only process exactly ${BATCH_SIZE} transactions in one batch.`
      );
    }
    return new TransactionBatch(xs);
  }
}
