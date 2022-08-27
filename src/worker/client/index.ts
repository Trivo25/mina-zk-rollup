import crypto from 'crypto';
import { ChannelCredentials } from '@grpc/grpc-js';
import {
  ProverServiceClient,
  IProverServiceClient,
} from '../protos_gen/prover.grpc-client.js';

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
}
