import express from 'express';
import bodyParser from 'body-parser';
import setRoutes from './routes';
import cors from 'cors';
function setupServer(): express.Application {
  const server = express();
  server.use(cors());
  server.use(bodyParser.json());
  setRoutes(server);
  return server;
}

export default setupServer();
