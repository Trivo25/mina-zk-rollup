import express from 'express';

import Controller from './Controller';
import RollupService from '../services/RollupService';

import EnumError from '../interfaces/EnumError';

import ISignature from '../interfaces/ISignature';
import ITransaction from '../interfaces/ITransaction';

import { base58Encode } from '../../lib/base58';

import { sha256 } from '../../lib/sha256';

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
          field: req.body.signature.field,
          scalar: req.body.signature.scalar,
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
      publicKey: req.body.publicKey,
      signature: {
        field: req.body.signature.field,
        scalar: req.body.signature.scalar,
      },
      payload: req.body.payload,
    };

    let jsonObj = JSON.parse(req.body.payload);

    let transaction: ITransaction = {
      from: jsonObj.from,
      to: jsonObj.to,
      amount: jsonObj.amount,
      nonce: jsonObj.nonce,
      memo: jsonObj.memo,
      signature: signature,
      time_received: Date.now().toString(),
      hash: undefined,
    };

    console.log(
      `from ${transaction.from} to ${transaction.to} amount ${transaction.amount} memo ${transaction.memo} nonce ${transaction.nonce}`
    );

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
