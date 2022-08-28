import { CloudAPI, Instance } from './cloud_api/api';

export class WorkerManager {
  private c: CloudAPI;

  private workerPool: WorkerPool | undefined = undefined;

  constructor(c: CloudAPI) {
    this.c = c;
  }

  prepareWorkerPool(load: any, options: PoolOptions): WorkerPool {
    if (options.width % 2 != 0) {
      throw new Error(
        'Can not initialize worker pool with an odd amount of worker nodes.'
      );
    }
    return {
      pool: [],
      start() {},
    };
  }

  cleanUp() {}
}

interface PoolOptions {
  width: number;
}

interface WorkerPool {
  pool: Instance[];
  start(): void;
}
