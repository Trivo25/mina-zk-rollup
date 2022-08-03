import express from 'express';
import QueryController from '../controllers/QueryController';
import RollupController from '../controllers/RollupController';

export default (
  server: express.Application,
  rc: RollupController,
  qc: QueryController
) => {
  server.post(`/rollup/verify`, rc.verify);
  server.post(`/rollup/processTransaction`, rc.processTransaction);

  server.get(`/query/transactionPool`, qc.getTransactionPool);
  server.get(`/query/transactionHistory`, qc.getTransactionHistory);
  server.get(`/query/accounts`, qc.getAccounts);
  server.get(`/query/blocks`, qc.getBlocks);
  server.get(`/query/stats`, qc.stats);
};
