import { ChallengeRequest, ChallengeResponse } from '../../protos_gen/prover';
import { randomChallenge } from '../challenge.js';
import * as grpc from '@grpc/grpc-js';

export function requestChallenge(
  call: grpc.ServerUnaryCall<ChallengeRequest, ChallengeResponse>,
  callback: grpc.sendUnaryData<ChallengeResponse>
): void {
  console.log('got request ', call.request);
  let r: ChallengeResponse = {
    challenge: randomChallenge(),
  };
  callback(null, r);
}
