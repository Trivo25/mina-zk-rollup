import 'dotenv/config';
import Application from './setup/server.js';

import logger from '../lib/log';

const PORT = process.env.SEQUENCER_REST_PORT || 5000;

start();

async function start() {
  logger.info(`Starting operator..`);

  Application.express.listen(PORT, () => {
    logger.info(`Rollup operator running on port ${PORT}`);
  });
}
