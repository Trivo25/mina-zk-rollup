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
    try {
      let signature: ISignature = {
        publicKey: req.body.publicKey,
        signature: {
          field: req.body.signature.field,
          scalar: req.body.signature.scalar,
        },
        payload: req.body.payload,
      };
      let success: boolean = this.service.verify(signature);
      return res.status(success ? 200 : 400).send({
        error: success ? undefined : EnumError.InvalidSignature,
        payload: success,
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
    return res.status(200).send();
  }
}

export default new RollupController(new RollupService());
