import express from 'express';
import QueryController from '../controllers/QueryController';
import RollupController from '../controllers/RollupController';

export default (server: express.Application) => {
  server.post(`/rollup/verify`, RollupController.verify);
  server.post(`/rollup/transaction`, RollupController.transaction);

  server.get(`/query/transactionPool`, QueryController.getTransactionPool);
  server.get(`/query/addresses`, QueryController.getAddresses);
  server.get(`/query/blocks`, QueryController.getBlocks);

  server.get(`/query/stats`, QueryController.stats);

  // ! Dummy endpoints for demo
  server.post(`/rollup/createAccount`, RollupController.createAccount);
};
