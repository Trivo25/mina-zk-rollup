import { ChannelCredentials } from '@grpc/grpc-js';
import { Msg } from '../protos_gen/msg.js';
import {
  MsgSerivceClient,
  IMsgSerivceClient,
} from '../protos_gen/msg.grpc-client.js';

const client = new MsgSerivceClient(
  'localhost:5000',
  ChannelCredentials.createInsecure(),
  {},
  {}
);

await callUnary(client);

function callUnary(client: IMsgSerivceClient) {
  let m: Msg = {
    name: '2',
    id: 2n,
    years: 2,
  };
  client.echo(m, (err, value) => {
    if (err) {
      console.log('got err: ', err);
    }
    if (value) {
      console.log('got response message: ', value);
    }
  });
}
