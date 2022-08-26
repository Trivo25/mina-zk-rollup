import { DataStore } from '.';
import { Level } from 'level';

import {
  AbstractBatchPutOperation,
  AbstractBatchDelOperation,
  AbstractSublevel,
} from 'abstract-level';

export type Put = AbstractBatchPutOperation<Level<string, any>, string, any>;
export type Delete = AbstractBatchDelOperation<Level<string, any>, string>;

export type SubLevel = AbstractSublevel<
  Level<string, any>,
  string | Buffer | Uint8Array,
  string,
  string
>;

export class LevelStore {
  protected store: Level<string, any>;

  protected instructions: (Put | Delete)[];

  constructor(path: string) {
    this.instructions = [];
    this.store = new Level<string, any>(path, { valueEncoding: 'json' });
  }

  clear(): Promise<void> {
    throw new Error('Method not implemented.');
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
