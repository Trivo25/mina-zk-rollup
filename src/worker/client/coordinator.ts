import { BooleanArray } from 'aws-sdk/clients/rdsdataservice';
import { CloudAPI, Instance } from './cloud_api/api';

export class Coordinator {
  private c: CloudAPI;

  private workers: Instance[] | undefined = undefined;

  private poolIsReady: boolean = false;

  constructor(c: CloudAPI) {
    this.c = c;
  }

  async prepareWorkerPool(
    load: any,
    options: PoolOptions
  ): Promise<WorkerPool> {
    let instances = await this.c.createInstance(options.width);
    this.workers = instances;
    while (!this.poolIsReady) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.checkReadiness();
    }

    console.log('POOL IS READY!');

    return {
      pool: [],
      start() {},
    };
  }

  private async checkReadiness() {
    // i couldnt figure out an more optimal way of checking if all instances are ready
    let instanceData = await this.c.listAll(this.workers, 'running');
    if (instanceData.length == this.workers?.length) {
      this.poolIsReady = true;
    }
  }

  cleanUp() {
    this.c.terminateInstance(this.workers!);
  }
}

interface PoolOptions {
  width: number;
}

interface WorkerPool {
  pool: Instance[];
  start(): void;
}
