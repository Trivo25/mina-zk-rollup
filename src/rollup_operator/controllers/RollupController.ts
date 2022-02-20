import express from 'express';
import Controller from './Controller';
import RollupService from '../services/RollupService';
import EnumError from '../../lib/models/interfaces/EnumError';
import ISignature from '../../lib/models/interfaces/ISignature';
import ITransaction from '../../lib/models/interfaces/ITransaction';
import IPublicKey from '../../lib/models/interfaces/IPublicKey';

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
        r: req.body.signature.r,
        s: req.body.signature.s,
      };

      let payload = req.body.payload;
      let publicKey: IPublicKey = req.body.publicKey;

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
        from: req.body.from,
        to: req.body.to,
        amount: req.body.amount,
        nonce: req.body.nonce,
        sender_publicKey: req.body.sender_publicKey,
        receiver_publicKey: req.body.receiver_publicKey,
        payload: req.body.payload,
        signature: signature,
        method: req.body.method, // TODO: maybe verify method via a signature?
      };

      let processorReponse: any;
      switch (transaction.method) {
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

export default new RollupController(new RollupService());
