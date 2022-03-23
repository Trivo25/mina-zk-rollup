import express from 'express';
import Controller from './Controller';
import RollupService from '../services/RollupService';
import EnumError from '../../lib/models/enums/EnumError';
import ISignature from '../../lib/models/interfaces/ISignature';
import ITransaction from '../../lib/models/interfaces/ITransaction';
import IPublicKey from '../../lib/models/interfaces/IPublicKey';
import { IPFS_Log, PSQL } from '../setup/IndexerOptions';
import Indexer from '../setup/Indexer';

class RollupController extends Controller<RollupService> {
  constructor(service: RollupService) {
    super(service);
    this.verify = this.verify.bind(this);
    this.transaction = this.transaction.bind(this);
  }

  async verify(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    try {
      let signature: ISignature = {
        r: req.body.transaction_data.signature.r,
        s: req.body.transaction_data.signature.s,
      };

      let payload = req.body.transaction_data.payload;
      let publicKey: IPublicKey = req.body.transaction_data.sender_publicKey;

      let veriferResponse: any | EnumError = this.service.verify(
        signature,
        payload,
        publicKey
      );

      return res.status(200).send({
        error: undefined,
        payload: veriferResponse,
      });
    } catch (err) {
      return res.status(400).send({
        error: EnumError.BrokenSignature,
        payload: undefined,
      });
    }
  }

  async transaction(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    try {
      let signature: ISignature = {
        r: req.body.signature.r,
        s: req.body.signature.s,
      };

      let transaction: ITransaction = {
        meta_data: {
          from: req.body.from,
          to: req.body.to,
          amount: req.body.amount,
          nonce: req.body.nonce,
          method: req.body.method, // TODO: maybe verify method via a signature?
        },
        transaction_data: {
          sender_publicKey: req.body.sender_publicKey,
          receiver_publicKey: req.body.receiver_publicKey,
          payload: req.body.payload,
          signature: signature,
        },
      };

      let processorReponse: any;
      switch (transaction.meta_data.method) {
        case 'simple_transfer':
          processorReponse = this.service.processTransaction(transaction);
          break;
        default:
          processorReponse = EnumError.InvalidMethod;
          break;
      }

      return res.status(200).send({
        error: undefined,
        payload: processorReponse,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        payload: undefined,
      });
    }
  }
}

export default new RollupController(
  new RollupService(
    new Indexer({
      ipfs_log: IPFS_Log,
      psql: PSQL,
    })
  )
);
