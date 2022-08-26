const config = {
  app: {
    port: 3000,
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
      privateKey: 'EKEfcsQRnT4FDeu2jKWFQJB168GAqZyPiVhC5dvTgSsFsAozXPaG', // just a dummy key :))))
      publicKey: 'B62qpkPHkmoG73CdpDxHzNVkYse7vRH13jwNjcM3sgCVcJt5az64Aru',
      isDeployed: true,
    },
  },
  prover: {
    produceProof: false,
  },
  ledgerHeight: 3,
  depositHeight: 3,
  batchSize: 2,
  remote: false,
};

export default config;
