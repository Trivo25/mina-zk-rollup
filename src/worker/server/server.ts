import jayson from 'jayson';

import {
  echo,
  requestChallenge,
  verify,
  proveBatch,
} from './handlers/index.js';

export const getServer = () =>
  new jayson.server({
    echo: echo,
    requestChallenge: requestChallenge,
    verify: verify,
    proveBatch: proveBatch,
  });
