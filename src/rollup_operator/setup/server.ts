import express from 'express';
import bodyParser from 'body-parser';
import setRoutes from './routes';
import cors from 'cors';

import RollupController from '../controllers/RollupController';
import RollupService from '../services/RollupService';
import QueryController from '../controllers/QueryController';
import QueryService from '../services/QueryService';

import { LevelStore } from '../data_store';
import { GlobalEventHandler } from '../events';
import { Level } from 'level';

function setupServer(): express.Application {
  const server = express();
  server.use(cors());
  server.use(bodyParser.json());

  let globalStore = new LevelStore(
    new Level<string, any>('./db', { valueEncoding: 'json' }),
    'rollup_sequencer'
  );

  let rc = new RollupController(
    new RollupService(globalStore, GlobalEventHandler)
  );
  let qc = new QueryController(
    new QueryService(globalStore, GlobalEventHandler)
  );

  setRoutes(server, rc, qc);
  return server;
}

export default setupServer();
