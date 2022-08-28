import crypto from 'crypto';
import { ChannelCredentials } from '@grpc/grpc-js';
import {
  ProverServiceClient,
  IProverServiceClient,
} from '../protos_gen/prover.grpc-client.js';
import { AWS, Region } from './cloud_api/aws.js';
import 'dotenv/config';

let ec2 = new AWS(undefined, Region.US_EAST_1);

/* let i = await ec2.createInstance();
await ec2.stopInstances([i.id]);
await ec2.startInstance([i.id]);
await ec2.deleteInstance([i.id]);
console.log(i);
 */

await ec2.listAll();
/* 
const client = new ProverServiceClient(
  'localhost:5000',
  ChannelCredentials.createInsecure(),
  {},
  {}
);

await echo(client);

function echo(client: IProverServiceClient) {
  try {
    client.echo(
      {
        echo: '123',
      },
      (err, value) => {
        if (err) {
          console.log('got err: ', err);
        }
        if (value) {
          console.log('got response message: ', value);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
} */
