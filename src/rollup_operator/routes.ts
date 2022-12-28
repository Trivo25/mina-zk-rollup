import express from 'express';
import QueryController from './controllers/QueryController.js';
import RollupController from './controllers/RollupController.js';
export { setRoutes };
function setRoutes(
  server: express.Application,
  rc: RollupController,
  qc: QueryController
) {
  server.post(`/rollup/verify`, rc.verify);
  server.post(`/rollup/processTransaction`, rc.processTransaction);

  server.post(`/query/pendingDeposits`, qc.pendingDeposits);
  server.post(
    `/query/transactionsForAccount`,
    qc.getTransactionHistoryForAddress
  );
  server.get(`/query/transactionPool`, qc.getTransactionPool);
  server.get(`/query/transactionHistory`, qc.getTransactionHistory);
  server.get(`/query/accounts`, qc.getAccounts);
  server.get(`/query/blocks`, qc.getBlocks);
  server.get(`/query/stats`, qc.stats);
}
