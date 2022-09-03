import jayson from 'jayson/promise/index.js';
import { AWS, Region } from './cloud_api/aws.js';
import 'dotenv/config';

let ec2 = new AWS(undefined, Region.US_EAST_1);
let i = await ec2.createInstance();
console.log(i);
/*

let all = await ec2.listAll(true);
console.log(all);
await ec2.terminateInstance(all);
*/
/* 
const start = async (port: number = 3000) => {
  const client = jayson.Client.http({
    host: 'localhost',
    port,
  });

  let res = await client.request('proveBatch', [1]);
  console.log(res);
};

start(3000);
start(3001);
start(3002);
 */
