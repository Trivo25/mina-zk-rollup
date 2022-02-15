import express from 'express';

import Controller from './Controller.js';
import RollupService from '../services/RollupService.js';

import EnumError from '../models/EnumError.js';

class RollupController extends Controller<RollupService> {
  constructor(service: RollupService) {
    super(service);
    this.verify = this.verify.bind(this);
  }

  async verify(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    let signature: ISignature = {
      publicKey: req.body.publicKey,
      signature: req.body.signature,
      payload: req.body.payload,
    };
    let success = this.service.verify(signature);
    let reponse: IHTTPResponse = {
      error: success ? undefined : EnumError.InvalidSignature,
      payload: success,
    };
    return res.status(success ? 200 : 400).send(reponse);
  }
}

export default new RollupController(new RollupService());
