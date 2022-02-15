import 'dotenv/config';

import Connection from './config/database.js';
import server from './config/server.js';

const PORT = process.env.PORT || 5000;

init();

async function init() {
  let client = await Connection.getInstance().connect();
  let res = await client.query('SELECT * FROM persons');
  console.log(res.rows);
  server.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
  });
}
