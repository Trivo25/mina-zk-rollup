import { arrayProp, CircuitValue } from 'snarkyjs';
import Config from '../../config/config.js';
import RollupDeposit from './RollupDeposit.js';
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
