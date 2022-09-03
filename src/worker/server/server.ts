import jayson from 'jayson';

import { echo, proveBatch, recurse } from './handlers/index.js';

export const getServer = () =>
  new jayson.server(
    {
      echo: echo,
      proveBatch: proveBatch,
      recurse: recurse,
    },
    { useContext: true }
  );
