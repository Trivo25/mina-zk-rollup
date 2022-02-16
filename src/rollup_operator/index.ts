import 'dotenv/config';
import EventHandler from './setup/EvenHandler.js';
import server from './setup/server.js';
const PORT = process.env.PORT || 5000;

init();

async function init() {
  EventHandler.getInstance().emit('test');

  server.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
  });
}