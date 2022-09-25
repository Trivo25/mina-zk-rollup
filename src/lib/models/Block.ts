import { RollupState } from '../../proof_system';

export class Block {
  stateBefore: RollupState;
  stateAfter: RollupState;
  txs: [];

  constructor(stateBefore: RollupState, stateAfter: RollupState) {
    this.stateBefore = stateBefore;
    this.stateAfter = stateAfter;
    this.txs = [];
  }
}
