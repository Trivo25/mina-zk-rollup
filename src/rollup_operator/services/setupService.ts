import { SmartContract } from 'snarkyjs';
import QueryController from '../controllers/QueryController';
import RollupController from '../controllers/RollupController';
import GlobalEventHandler from '../events/gobaleventhandler';
import { setRoutes } from '../routes';
import QueryService from './QueryService';
import { RollupService } from './RollupService';
import { GlobalState } from './Service';
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
