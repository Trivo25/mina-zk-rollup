import { isReady } from 'snarkyjs';

const run = async () => {
  await isReady;
  console.log('STARTING INTEGRATION TESTS');
  try {
    await import('./prover');
    await import('./rollup_service');
  } catch (error) {
    console.log('encountered an error running integration tests');
    console.log(error);
    process.exit(1);
  }
  console.log('INTEGRATION TESTS FINISHED');
  process.exit(0);
};

run();
