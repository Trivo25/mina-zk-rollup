import 'dotenv/config';
import Application from './setup/server.js';
import Config from '../config/config';

import logger from '../lib/log';
import { PrivateKey } from 'snarkyjs';
import { signTx } from '../client_sdk/index.js';
import { ITransaction } from '../lib/models/index.js';
import RollupService from './services/RollupService.js';

start();

async function start() {
  logger.info(`Starting operator..`);

  let App = await Application;

  testRun(App.rollupService, raw[0], raw[1], 0);
  testRun(App.rollupService, raw[0], raw[2], 1);
  testRun(App.rollupService, raw[0], raw[3], 2);
  testRun(App.rollupService, raw[0], raw[2], 3);

  App.express.listen(Config.app.port, () => {
    logger.info(`Rollup operator running on port ${Config.app.port}`);
  });
}

let raw = [
  {
    publicKey: 'B62qpkPHkmoG73CdpDxHzNVkYse7vRH13jwNjcM3sgCVcJt5az64Aru',
    privateKey: 'EKEfcsQRnT4FDeu2jKWFQJB168GAqZyPiVhC5dvTgSsFsAozXPaG',
  },
  {
    publicKey: 'B62qmh1etPvw576SaENiQvD9sMURNfQ4B6fCXLHWzhuzSiAHkycr8NS',
    privateKey: 'EKF6PAAbpxkxYofq5JM4wpzRgCBGGZ5FJg6785ZyGFhwLBxCe5w5',
  },
  {
    publicKey: 'B62qm1P3vvQQq2Ro6xyNf8bBLyExHxiG3B45dTiNFcfimNnS1rTeicW',
    privateKey: 'EKFTGFrC4AKoaHfvFgoya4sYUfq3wu2zDwDqZBXrPVm6RpRffchb',
  },
  {
    publicKey: 'B62qqdakgumxVsGXfB5ouwHwthaWy8ZZPedjCRcRgk8aGp72R82zC2G',
    privateKey: 'EKDmSSoryde5ZEY9W9koA2BYL7PgDJLjZYuv6s9Mc2SkSZE1hmAu',
  },
];

const testRun = (rs: RollupService, from: any, to: any, nonce: number) => {
  let tx: ITransaction = {
    from: from.publicKey,
    to: to.publicKey,
    amount: '100',
    nonce: nonce.toString(),
    tokenId: '0',
    signature: {
      r: '1',
      s: '1',
    },
  };

  tx = signTx(tx, PrivateKey.fromBase58(from.privateKey));
  rs.processTransaction(tx);
};
