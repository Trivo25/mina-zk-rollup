import { isReady, PublicKey, shutdown } from 'snarkyjs';

const init = async () => {
  await isReady;

  shutdown();
};

init();

export {};
