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

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

let challenge = '';

await challengeRequest(client);

await verifyRequest(client);

function challengeRequest(client: IProverServiceClient) {
  try {
    client.requestChallenge(
      {
        publicKey: publicKey
          .export({ type: 'pkcs1', format: 'pem' })
          .toString('utf-8'),
        keyType: 'rsa',
      },
      (err, value) => {
        if (err) {
          console.log('got err: ', err);
        }
        if (value) {
          console.log('got response message: ', value);
          challenge = value.challenge;
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}

function verifyRequest(client: IProverServiceClient) {
  try {
    client.verify(
      {
        challenge,
        signature: crypto
          .sign('sha256', Buffer.from(challenge), {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          })
          .toString('base64'),
        publicKey: publicKey
          .export({ type: 'pkcs1', format: 'pem' })
          .toString('utf-8'),
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
