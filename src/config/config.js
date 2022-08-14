const config = {
  app: {
    port: 3000,
    batchSize: 2,
  },
  graphql: {
    endpoint: 'https://proxy.berkeley.minaexplorer.com/graphql',
    remote: false,
  },
  accounts: {
    feePayer: {
      privateKey: 'EKEfcsQRnT4FDeu2jKWFQJB168GAqZyPiVhC5dvTgSsFsAozXPaG', // just a dummy key :))))
      publicKey: 'B62qpkPHkmoG73CdpDxHzNVkYse7vRH13jwNjcM3sgCVcJt5az64Aru',
    },
    zkApp: {
      /*       privateKey: 'EKF4tcSsAjugCyYjSvTVhTzL2YRjFmvHRHgvDDspajzwmXnZ76n5', // just a dummy key :))))
      publicKey: 'B62qrnS2e7Ffmc5hAr8VsiN1SJEGhwKicGVPF5MwjqtqnyhQGAawu59', */
      privateKey: 'EKEfcsQRnT4FDeu2jKWFQJB168GAqZyPiVhC5dvTgSsFsAozXPaG', // just a dummy key :))))
      publicKey: 'B62qpkPHkmoG73CdpDxHzNVkYse7vRH13jwNjcM3sgCVcJt5az64Aru',
      isDeployed: true,
    },
  },
  prover: {
    produceProof: false,
  },
  ledgerHeight: 3,
};

export default config;
