import express from 'express';

import Controller from './Controller';
import RollupService from '../services/RollupService';

import EnumError from '../../lib/models/interfaces/EnumError';

import ISignature from '../../lib/models/interfaces/ISignature';
import ITransaction from '../../lib/models/interfaces/ITransaction';

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
    /*
    Example payload    
    {
      "publicKey": "B62qmNsne47XJamGRsmckG6L16QZu7cGCA7avTEi4zCzPzxmmXgAj7w",
      "signature": {
        "field": "7797250386283974212481778052523307015056807928189716961253856328756529747873",
        "scalar": "7843613972680634670880673355411715345749981823944101735387873769093458498464"
      },
      "payload": "{\"message\":\"Hello\"}"
    }
    */
    try {
      let signature: ISignature = {
        publicKey: req.body.publicKey,
        signature: {
          r: req.body.signature.r,
          s: req.body.signature.s,
        },
        payload: req.body.payload,
      };
      let veriferResponse: boolean | EnumError = this.service.verify(signature);

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
      publicKey: req.body.signature.publicKey,
      signature: {
        r: req.body.signature.signature.r,
        s: req.body.signature.signature.s,
      },
      payload: req.body.signature.payload,
    };

    let transaction: ITransaction = {
      from: req.body.from,
      to: req.body.to,
      amount: req.body.amount,
      nonce: req.body.nonce,
      publicKey: req.body.signature.publicKey,
      signature: signature,
    };

    //console.log(transaction);

    console.log(`new incoming transaction request`);

    let processorReponse: string | EnumError =
      this.service.processTransaction(transaction);

    let isSuccess = typeof processorReponse === 'string';
    return res.status(isSuccess ? 200 : 400).send({
      error: isSuccess ? undefined : processorReponse,
      payload: isSuccess
        ? {
            transaction_hash: processorReponse,
          }
        : undefined,
    });
  }
}

export default new RollupController(new RollupService());
