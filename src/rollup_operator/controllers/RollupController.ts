import express from 'express';

import Controller from './Controller.js';
import RollupService from '../services/RollupService.js';

class RollupController extends Controller<RollupService> {
  constructor(service: RollupService) {
    super(service);
    this.verify = this.verify.bind(this);
  }

  async verify(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    let signature: Signature = {
      publicKey: req.body.publicKey,
      signature: req.body.signature,
      payload: req.body.payload,
    };

    return res.status(200).send(this.service.verify(signature));
  }
}

export default new RollupController(new RollupService());
