import 'dotenv/config';

import Connection from './config/database.js';
import server from './config/server.js';

const PORT = process.env.PORT || 5000;

init();

async function init() {
  server.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
  });
}
