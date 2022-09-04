import jayson from 'jayson/promise/index.js';
import { CloudAPI, Instance } from './cloud_api/api';
import logger from '../../lib/log/index.js';
export class Coordinator {
  private c: CloudAPI;

  private workers: Worker[] = [];

  private poolIsReady: boolean = false;

  constructor(c: CloudAPI) {
    this.c = c;
  }

  async compute(payload: any, options: PoolOptions): Promise<void> {
    logger.info('Creating worker instances..');
    let instances = await this.prepareWorkerPool(options);
    logger.info('All worker instances running');

    instances.forEach(async (i) => {
      const client = jayson.Client.http({
        host: i.ip,
        port: 3000,
      });
      this.workers.push({
        instance: i,
        client: client,
        state: State.NOT_CONNECTED,
      });
    });

    logger.info('Trying to establish connection to worker software..');

    let prev = Date.now();
    let res = await Promise.allSettled(
      this.workers.map((w) => this.establishClientConnection(w))
    );
    logger.info(
      `Connected to ${res.filter((r) => r.status == 'fulfilled').length}/${
        this.workers.length
      }, took ${(Date.now() - prev) / 1000}`
    );
    logger.info('Computation done - clean up');
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

  private async establishClientConnection(w: Worker): Promise<Worker> {
    let timeoutAfter = Date.now() + 500000; // 80s

    let c = Math.floor(Math.random() * 100);

    do {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        let res = await w.client!.request('echo', [c]);
        console.log(res);
        if (res.result[0] == [c]) w.state = State.IDLE;
      } catch (error) {
        error;
      }
    } while (w.state == State.NOT_CONNECTED && Date.now() <= timeoutAfter);

    if (w.state == State.NOT_CONNECTED) throw Error('timed out');
    return w;
  }

  cleanUp() {
    this.c.terminateInstance(this.workers.map((w) => w.instance));
  }
}

interface PoolOptions {
  width: number;
}

enum State {
  NOT_CONNECTED = 'not_connected',
  IDLE = 'idle',
  WORKING = 'working',
}
interface Worker {
  instance: Instance;
  client?: jayson.HttpClient;
  state: State;
}
