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

await callUnary(client);

function callUnary(client: IProverServiceClient) {
  try {
    client.requestChallenge(
      {
        publicKey: 'asd',
        keyType: '1',
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
