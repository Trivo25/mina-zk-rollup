import { startREST } from './api/controller.js';

init();

function init() {
  console.log('Starting REST server');

  startREST();
}
