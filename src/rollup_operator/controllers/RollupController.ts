import express from 'express';

import Controller from './Controller';
import RollupService from '../services/RollupService';

import EnumError from '../models/EnumError';

import ISignature from '../models/ISignature';
import ITransaction from '../models/ITransaction';

class RollupController extends Controller<RollupService> {
  constructor(service: RollupService) {
    super(service);
    this.verify = this.verify.bind(this);
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
          field: req.body.signature.field,
          scalar: req.body.signature.scalar,
        },
        type: req.body.type,
        payload: req.body.payload,
      };
      let veriferResponse: boolean | EnumError = this.service.verify(signature);
      return res.status(veriferResponse === true ? 200 : 400).send({
        error: veriferResponse === true ? undefined : veriferResponse,
        payload: veriferResponse,
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
      publicKey: req.body.publicKey,
      signature: {
        field: req.body.signature.field,
        scalar: req.body.signature.scalar,
      },
      type: req.body.type,
      payload: req.body.payload,
    };

    let jsonObj = JSON.parse(req.body.payload);

    let transaction: ITransaction = {
      from: jsonObj.from,
      to: jsonObj.to,
      amount: jsonObj.amount,
      nonce: jsonObj.nonce,
      memo: jsonObj.memo,
    };

    console.log(
      `from ${transaction.from} to ${transaction.to} amount ${transaction.amount} memo ${transaction.memo} nonce ${transaction.nonce}`
    );

    let processorReponse: boolean | EnumError = this.service.processTransaction(
      transaction,
      signature
    );

    return res.status(processorReponse === true ? 200 : 400).send({
      error: processorReponse === true ? undefined : processorReponse,
      payload: processorReponse,
    });
  }
}

export default new RollupController(new RollupService());
