import { ProofRequest, ProofResponse } from '../../protos_gen/prover.js';
import * as grpc from '@grpc/grpc-js';

export function proveBatch(
  call: grpc.ServerUnaryCall<ProofRequest, ProofResponse>,
  callback: grpc.sendUnaryData<ProofResponse>
): void {
  let r: ProofResponse = {};
  callback(null, r);
}
