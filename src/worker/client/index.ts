import jayson from 'jayson';
import { AWS, Region } from './cloud_api/aws.js';
import 'dotenv/config';

let ec2 = new AWS(undefined, Region.US_EAST_1);
/* let i = await ec2.createInstance();
console.log(i); */

let all = await ec2.listAll(true);
console.log(all);
await ec2.terminateInstance(all);

/*
const client = jayson.Client.http({
  port: 3000,
});

client.request('echo', [1, 1], function (err: any, response: any) {
  if (err) throw err;
  console.log(response.result); // 2
});
*/
