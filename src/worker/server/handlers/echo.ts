import { EchoRequest, EchoResponse } from '../../protos_gen/prover.js';
import * as grpc from '@grpc/grpc-js';

export function echo(
  call: grpc.ServerUnaryCall<EchoRequest, EchoResponse>,
  callback: grpc.sendUnaryData<EchoResponse>
): void {
  let m: EchoResponse = {
    echo: 'echo',
  };
  callback(null, m);
}
