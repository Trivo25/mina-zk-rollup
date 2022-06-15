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

export default class LevelStore extends DataStore {
  private store: Level<string, any>;
  private nodes: SubLevel;
  private leaves: SubLevel;

  private instructionStack: (Put | Delete)[];

  constructor(db: Level<string, any>, id: string) {
    super();
    this.instructionStack = [];
    this.store = db;
    this.nodes = this.store.sublevel(id);
    this.leaves = this.store.sublevel(id + '-leaf');
  }
}
