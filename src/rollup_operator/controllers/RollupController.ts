import express from 'express';
import Controller from './Controller';
import RollupService from '../services/RollupService';
import {
  EnumError,
  ISignature,
  ITransaction,
  IPublicKey,
} from '../../lib/models';

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
        r: req.body.transaction_data.signature.r,
        s: req.body.transaction_data.signature.s,
      };

      let transaction: ITransaction = {
        meta_data: {
          from: req.body.meta_data.from,
          to: req.body.meta_data.to,
          amount: req.body.meta_data.amount,
          nonce: req.body.meta_data.nonce,
          method: req.body.meta_data.method, // TODO: maybe verify method via a signature?
          // NOTE: THIS IS DUMMY DATA
          fee: '1',
          time: Date.now().toString(),
        },
        transaction_data: {
          sender_publicKey: req.body.transaction_data.sender_publicKey,
          receiver_publicKey: req.body.transaction_data.receiver_publicKey,
          payload: req.body.transaction_data.payload,
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

export default RollupController;
