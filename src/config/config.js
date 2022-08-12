const config = {
  app: {
    port: 3000,
    batchSize: 4,
  },
  graphql: {
    endpoint: 'https://proxy.berkeley.minaexplorer.com/graphql',
  },
  accounts: {
    feePayer: {
      privateKey: 'EKEfcsQRnT4FDeu2jKWFQJB168GAqZyPiVhC5dvTgSsFsAozXPaG', // just a dummy key :))))
      publicKey: 'B62qpkPHkmoG73CdpDxHzNVkYse7vRH13jwNjcM3sgCVcJt5az64Aru',
    },
    zkApp: {
      privateKey: 'EKE6AxrCkbGRJDqL3RdRwiCKi6UXbUiz3SZ3doro65YrA857FK8J', // just a dummy key :))))
      publicKey: 'B62qikGt3GMNqCQtcsJ6DRTTwUC79haVtt4yJrXEei4K81Cj3uyepgm',
      isDeployed: false,
    },
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
