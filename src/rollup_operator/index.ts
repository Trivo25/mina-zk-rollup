import 'dotenv/config';

import Connection from './config/database.js';
import server from './config/server.js';

const PORT = process.env.PORT || 5000;

init();

import * as MinaSDK from '@o1labs/client-sdk';

let keys = MinaSDK.genKeys();

let payload = {
  message: 'Hello',
};

let signed = MinaSDK.signMessage(JSON.stringify(payload), keys);
console.log(keys.publicKey);
console.log(signed);
console.log('payload');
// need to escape " with \" because otherwise sign would be broken
console.log(JSON.stringify(payload).replace(/"/g, '\\"'));

async function init() {
  server.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
  });
}
