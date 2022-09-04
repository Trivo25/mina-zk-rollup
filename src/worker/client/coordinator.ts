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

  async compute(
    payload: any[],
    expectedResult: any,
    options: PoolOptions
  ): Promise<void> {
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

    // TODO: require the have the correct amount of instances running
    // TODO: create fallbacks if one fails
    logger.info('Starting computation!');

    let result = this.computeOnWorkers(payload, this.workers);
    if (result != expectedResult) {
      throw Error('Result does not match expected result!');
    }
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

  private async computeOnWorkers(payload: any[], workers: Worker[]) {
    if (payload.length != workers.length) {
      throw Error('Payload length does not equal worker count');
    }

    // we push elements on to the stack, once we have results, we find fitting ones and recurse them
    // if we have to resutls on the stack, this means we also have two idle workers
    let queue: TaskQueue<Task> = new TaskQueue<Task>(
      (openTasks: Task[]) => {
        if (openTasks.length == 1) return [];
        let xs: Task[] = [];
        return xs;
      },
      (selectedTasks: Task[]) => {
        if (selectedTasks.length == 1) return [];
        let xs: Task[] = [];
        return xs;
      }
    );

    Promise.allSettled(
      workers.map((w, i) => {
        return base(w, queue[i]);
      })
    );

    function findTasks(xs: Task[]): Task[] {
      return [xs[0], xs[1]];
    }

    async function base(w: Worker, t1: Task): Promise<void> {
      w.state = State.WORKING;
      let res = await w.client?.request('proveBatch', [t1]);
      w.state = State.IDLE;

      queue.push({
        data: res.result[0],
        level: 0,
        index: 0,
      });
    }

    async function recurse(w: Worker, t1: Task, t2: Task): Promise<any> {
      w.state = State.WORKING;
      let res = await w.client?.request('recurse', [t1, t2]);
      w.state = State.IDLE;
      return res.result[0];
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
  NOT_CONNECTED = 'not_connected',
  IDLE = 'idle',
  WORKING = 'working',
  TERMINATED = 'terminated',
}
interface Worker {
  instance: Instance;
  client?: jayson.HttpClient;
  state: State;
}
interface Task {
  data: any;
  level: number;
  index: number;
}
class TaskQueue<T> extends Array<T> {
  private f: (xs: T[], n: number) => T[];
  private r: (xs: T[], n: number) => T[];

  private isIdle: boolean = false;

  constructor(
    f: (xs: T[]) => T[],
    r: (xs: T[]) => T[],
    isIdle: boolean = false
  ) {
    super();
    this.f = f;
    this.r = r;
    this.isIdle = isIdle;
  }

  push(...items: T[]): number {
    let n = super.push(...items);
    this.filterAndReduce();
    return n;
  }

  private filterAndReduce() {
    if (!this.isIdle) {
      let n = this.length;
      let ys = this.f(this, n);
      if (ys != undefined) {
        for (let y of ys) {
          let i = this.indexOf(y);
          if (i != -1) {
            this.splice(i, 1);
          }
        }
        let newTasks = this.r(ys, n);
        if (super.push(...newTasks) > 1) this.filterAndReduce();
      }
    }
  }

  idle() {
    this.isIdle = true;
  }

  work() {
    this.isIdle = false;
    this.filterAndReduce();
  }
}
