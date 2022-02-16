import express from 'express';
import QueryController from '../controllers/QueryController';

import RollupController from '../controllers/RollupController';

export default (server: express.Application) => {
  server.post(`/rollup/verify`, RollupController.verify);
  server.post(`/rollup/transferFunds`, RollupController.transferFunds);

  server.get(`/query/transactionPool`, QueryController.getTransactionPool);
};
