import express from 'express';

import RequestController from '../controllers/RequestController.js';

export default (server: express.Application) => {
  server.post(`/hello`, RequestController.hello);
};
