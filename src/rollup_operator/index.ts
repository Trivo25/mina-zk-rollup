import 'dotenv/config';
import server from './setup/server.js';

import logger from '../lib/log';

const PORT = process.env.PORT || 5000;

init();

async function init() {
  logger.info(`Starting operator..`);

  server.listen(PORT, () => {
    logger.info(`Rollup operator running on port ${PORT}`);
  });
}
