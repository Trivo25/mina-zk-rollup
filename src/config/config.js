const config = {
  app: {
    port: 3000,
    batchSize: 4,
  },
  prover: {
    produceProof: true,
  },
  db: {
    host: 'localhost',
    port: 27017,
    name: 'db',
  },
};

export default config;
