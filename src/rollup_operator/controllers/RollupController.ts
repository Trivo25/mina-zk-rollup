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
    this.transferFunds = this.transferFunds.bind(this);
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

      let veriferResponse: boolean | EnumError = this.service.verify(
        signature,
        payload,
        publicKey
      );

      let isSuccess = typeof veriferResponse === 'boolean';
      return res.status(veriferResponse === true ? 200 : 400).send({
        error: veriferResponse === true ? undefined : veriferResponse,
        payload: isSuccess
          ? {
              is_valid_signature: veriferResponse,
            }
          : undefined,
      });
    } catch (err) {
      return res.status(400).send({
        error: EnumError.BrokenSignature,
        payload: false,
      });
    }
  }

  async transferFunds(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
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
    };

    //console.log(transaction);

    console.log(`new incoming transaction request`);

    let processorReponse: boolean | EnumError =
      this.service.processTransaction(transaction);

    return res.status(processorReponse ? 200 : 400).send({
      error:
        typeof processorReponse === 'boolean' ? undefined : processorReponse,
      payload:
        typeof processorReponse === 'boolean'
          ? {
              transaction_hash: processorReponse,
            }
          : undefined,
    });
  }
}

export default new RollupController(new RollupService());
