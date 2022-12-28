import { SmartContract } from 'snarkyjs';
import QueryController from '../controllers/QueryController.js';
import RollupController from '../controllers/RollupController.js';
import GlobalEventHandler from '../events/gobaleventhandler.js';
import { setRoutes } from '../routes.js';
import QueryService from './QueryService.js';
import { RollupService } from './RollupService.js';
import { GlobalState } from './Service.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

export { setupService };

function setupService(
  globalState: GlobalState,
  p: any,
  contract: typeof SmartContract
) {
  const server = express();
  server.use(cors());
  server.use(bodyParser.json());

  let rs = new RollupService(globalState, GlobalEventHandler, p, contract);
  let rc = new RollupController(rs);
  let qc = new QueryController(
    new QueryService(globalState, GlobalEventHandler)
  );

  setRoutes(server, rc, qc);
  return server;
}
