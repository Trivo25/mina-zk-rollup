import 'dotenv/config';

import Connection from './config/database';
import server from './config/server';
import ITransaction from './models/ITransaction';

const PORT = process.env.PORT || 5000;

init();

async function init() {
  server.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
  });
}
