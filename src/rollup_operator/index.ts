import 'dotenv/config';
import server from './setup/server.js';
const PORT = process.env.PORT || 5000;

let oldLog = console.log;
console.log = function () {
  var args = [].slice.call(arguments);
  oldLog.apply(console.log, [`[${new Date().toISOString()}]`].concat(args));
};

init();

async function init() {
  console.log(`Starting operator..`);

  server.listen(PORT, () => {
    console.log(`Rollup operator running on port ${PORT}`);
  });
}
