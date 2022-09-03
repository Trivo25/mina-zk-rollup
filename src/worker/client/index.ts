import jayson from 'jayson';
import { AWS, Region } from './cloud_api/aws.js';
import 'dotenv/config';

/*
let ec2 = new AWS(undefined, Region.US_EAST_1);
let i = await ec2.createInstance();
await ec2.stopInstances([i.id]);
await ec2.startInstance([i.id]);
await ec2.deleteInstance([i.id]);
console.log(i);
await ec2.listAll();
*/

const client = jayson.Client.http({
  port: 3000,
});

client.request('echo', [1, 1], function (err: any, response: any) {
  if (err) throw err;
  console.log(response.result); // 2
});
