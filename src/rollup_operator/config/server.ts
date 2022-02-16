import express from 'express';
import bodyParser from 'body-parser';
import setRoutes from './routes';

function setupServer(): express.Application {
  const server = express();
  server.use(bodyParser.json());
  setRoutes(server);
  return server;
}

export default setupServer();
