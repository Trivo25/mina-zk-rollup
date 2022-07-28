import { isReady, shutdown } from 'snarkyjs';

const init = async () => {
  await isReady;

  shutdown();
};

init();

export {};
