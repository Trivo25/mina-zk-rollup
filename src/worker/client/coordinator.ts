import jayson from 'jayson';
import { CloudAPI, Instance } from './cloud_api/api';

export class Coordinator {
  private c: CloudAPI;

  private workers: Worker[] = [];

  private poolIsReady: boolean = false;

  constructor(c: CloudAPI) {
    this.c = c;
  }

  async compute(payload: any, options: PoolOptions): Promise<void> {
    console.log('Preparing computation phase - this can take a while');
    let instances = await this.prepareWorkerPool(options);
    console.log('All instances ready');

    instances.forEach(async (i) => {
      const client = jayson.Client.http({
        host: i.ip,
        port: 3000,
      });

      let res = await client.request('echo', [1]);
      console.log(res);
      this.workers.push({ instance: i, client: client, state: State.IDLE });
    });

    this.cleanUp();
  }

  async prepareWorkerPool(options: PoolOptions): Promise<Instance[]> {
    let instances = await this.c.createInstance(options.width);
    while (!this.poolIsReady) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.checkReadiness(instances);
    }
    return await this.c.listAll(instances, 'running');
  }

  private async checkReadiness(instances: Instance[]) {
    // i couldnt figure out an more optimal way of checking if all instances are ready
    let instanceData = await this.c.listAll(instances, 'running');
    if (instanceData.length == instances.length) {
      this.poolIsReady = true;
    }
  }

  cleanUp() {
    this.c.terminateInstance(this.workers.map((w) => w.instance));
  }
}

interface PoolOptions {
  width: number;
}

enum State {
  IDLE = 'idle',
  WORKING = 'working',
}
interface Worker {
  instance: Instance;
  client?: jayson.HttpClient;
  state: State;
}
