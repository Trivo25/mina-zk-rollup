import express from 'express';
const app = express();
const PORT = 8000;

import { transfer, withdraw } from './handlers/handlers.js';

export function startREST() {
  app.get('/transfer', transfer);
  app.get('/withdraw', withdraw);
  app.listen(PORT, () => {
    console.log(`[REST]: REST server running at https://localhost:${PORT}`);
  });
}
