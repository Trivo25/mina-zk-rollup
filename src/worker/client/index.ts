import jayson from 'jayson/promise/index.js';
import { AWS, Region } from './cloud_api/aws.js';
import 'dotenv/config';
import { Coordinator } from './coordinator.js';

/* let ec2 = new AWS(undefined, Region.US_EAST_1);

let coordinator = new Coordinator(ec2);

await coordinator.compute([5, 5, 5, 5], 20, {
  width: 3,
}); */

/* const start = async (port: number = 3000) => {
  const client = jayson.Client.http({
    host: '54.227.4.82',
    port,
  });

  let conned = false;
  while (!conned) {
    try {
      let res = await client.request('echo', [1]);
      console.log(res);
      conned = true;
      console.log('SEST');
    } catch (error) {
      error;
    }
  }
};

start(3000);
 */

class TaskWorker<T> extends Array<T> {
  // eslint-disable-next-line no-unused-vars
  private f: (xs: T[], n: number) => T[];
  // eslint-disable-next-line no-unused-vars
  private r: (xs: T[], n: number) => Promise<T[]>;

  result: T[] | undefined;

  private isIdle: boolean = false;

  constructor(
    // eslint-disable-next-line no-unused-vars
    f: (xs: T[]) => T[],
    // eslint-disable-next-line no-unused-vars
    r: (xs: T[]) => Promise<T[]>,
    isIdle: boolean = false
  ) {
    super();
    this.f = f;
    this.r = r;
    this.isIdle = isIdle;
    this.result = undefined;
  }

  /*   push(...items: T[]): number {
    let n = super.push(...items);
    //this.filterAndReduce();
    return n;
  }
 */
  prepare(...items: T[]) {
    this.idle();
    this.push(...items);
  }

  private async filterAndReduce() {
    if (!this.isIdle) {
      let n = this.length;
      let ys = this.f(this, n).slice();
      if (ys != undefined) {
        for (let y of ys) {
          let i = this.indexOf(y);
          if (i != -1) {
            this.splice(i, 1);
          }
        }
        let newTasks = await this.r(ys, n);
        if (ys.length < newTasks.length)
          throw Error('Adding more tasks than reducing');
        if (super.push(...newTasks) > 1) {
          await this.filterAndReduce();
        }
        if (this.length <= 1) this.result = this;
      }
    }
  }

  idle() {
    this.isIdle = true;
  }

  async work(): Promise<T> {
    this.isIdle = false;
    await this.filterAndReduce();
    return this.result![0];
  }
}

let timePerProof = 35000;

async function add(n1: number, n2: number): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, timePerProof));
  return n1 + n2;
}

async function base(n1: number): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, timePerProof));
  return n1 + 1;
}

const init = async () => {
  let totalComputationalSeconds = 0;

  let q = new TaskWorker<number>(
    (openTasks: number[]) => {
      return openTasks;
    },
    async (xs: number[]) => {
      if (xs.length == 1) return [];
      let promises = [];
      if (xs[0] == 1) {
        for (let i = 0; i < xs.length; i++) {
          promises.push(base(xs[i]));
        }
      } else {
        for (let i = 0; i < xs.length; i = i + 2) {
          promises.push(add(xs[i], xs[i + 1]));
        }
      }
      totalComputationalSeconds =
        totalComputationalSeconds + promises.length * timePerProof;
      xs = await Promise.all(promises);
      return xs;
    }
  );
  let exp = 8;
  let batchCount = 2 ** exp;
  let txPerBatch = 55;

  let hourPricePerInstance = 10; // $
  let secondPrice = hourPricePerInstance / 3600;

  q.prepare(...new Array<number>(batchCount).fill(1));

  let prev = Date.now();
  let res = await q.work();
  console.log('result: ', res);
  let elapsedInS = Date.now() - prev;
  console.log('instances needed: ', batchCount);
  console.log('elapesed: s', elapsedInS);
  console.log('block time ', exp * timePerProof);
  console.log('total tx : ', batchCount * txPerBatch);
  console.log('tps ', (batchCount * txPerBatch) / elapsedInS);
  let worstCaseTotalPrice = batchCount * (elapsedInS * secondPrice);
  console.log('worst case total price ', worstCaseTotalPrice);
  console.log(
    'worst case price per tx ',
    worstCaseTotalPrice / (batchCount * txPerBatch)
  );
  let bestCasePrice = totalComputationalSeconds * secondPrice;
  console.log('best case total price ', bestCasePrice);
  console.log(
    'best case price per tx ',
    bestCasePrice / (batchCount * txPerBatch)
  );

  console.log('totalComputationalSeconds', totalComputationalSeconds);
};
init();
