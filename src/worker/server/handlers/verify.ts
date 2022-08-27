import { VerifyResponse, VerifyRequest } from '../../protos_gen/prover';

import * as grpc from '@grpc/grpc-js';

export function verify(
  call: grpc.ServerUnaryCall<VerifyRequest, VerifyResponse>,
  callback: grpc.sendUnaryData<VerifyResponse>
): void {
  console.log('got request ', call.request);
  let isValid = true;

  let v: VerifyResponse = {
    isValid,
  };
  callback(null, v);
}
