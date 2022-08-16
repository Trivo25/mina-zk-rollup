import { isReady, shutdown } from 'snarkyjs';

const run = async () => {
  await isReady;
  console.log('STARTING INTEGRATION TESTS');
  try {
    await import('./prover');
  } catch (error) {
    console.log('encountered an error running integration tests');
    console.log(error);
    process.exit(1);
  }
  console.log('INTEGRATION TESTS FINISHED');
  setTimeout(shutdown, 0);
};

run();
