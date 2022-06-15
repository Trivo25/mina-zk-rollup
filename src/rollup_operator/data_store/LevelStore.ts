import { DataStore } from '.';
import { Level } from 'level';

import {
  AbstractBatchPutOperation,
  AbstractBatchDelOperation,
  AbstractSublevel,
} from 'abstract-level';

type Put = AbstractBatchPutOperation<Level<string, any>, string, any>;
type Delete = AbstractBatchDelOperation<Level<string, any>, string>;

type SubLevel = AbstractSublevel<
  Level<string, any>,
  string | Buffer | Uint8Array,
  string,
  string
>;

export default class LevelStore implements DataStore {
  private store: Level<string, any>;
  private nodes: SubLevel;
  private leaves: SubLevel;

  private instructions: (Put | Delete)[];

  constructor(path: string, id: string) {
    this.instructions = [];
    this.store = new Level<string, any>(path, { valueEncoding: 'json' });
    this.nodes = this.store.sublevel(id);
    this.leaves = this.store.sublevel(id + '-leaf');
  }

  clearInstructions(): void {
    this.instructions = [];
  }

  async commit(): Promise<void> {
    if (this.instructions.length > 0) {
      await this.store.batch(this.instructions);
    }

    this.clearInstructions();
  }
}
