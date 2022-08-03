import 'dotenv/config';
import Application from './setup/server.js';
import Config from '../config/config';

import logger from '../lib/log';

start();

async function start() {
  logger.info(`Starting operator..`);

  (await Application).express.listen(Config.app.port, () => {
    logger.info(`Rollup operator running on port ${Config.app.port}`);
  });
}
