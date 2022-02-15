import express from 'express';

import RollupController from '../controllers/RollupController.js';

export default (server: express.Application) => {
  server.post(`/rollup/verify`, RollupController.verify);
  server.post(`/rollup/transferFunds`, RollupController.transferFunds);
};
