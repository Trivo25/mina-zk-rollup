import { IProverService } from '../protos_gen/prover.grpc-server';
import {
  echo,
  requestChallenge,
  verify,
  proveBatch,
} from './handlers/index.js';

export const service: IProverService = {
  echo: echo,
  requestChallenge: requestChallenge,
  verify: verify,
  proveBatch: proveBatch,
};
