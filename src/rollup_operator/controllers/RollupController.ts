import express from 'express';
import Controller from './Controller';
import RollupService from '../services/RollupService';
import { EnumError } from '../../lib/models';

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
      return res.status(200).send({
        error: undefined,
        payload: 'veriferResponse',
      });
    } catch (err) {
      return res.status(400).send({
        error: EnumError.BrokenSignature,
        payload: undefined,
      });
    }
  }
}

export default RollupController;
