import express from 'express';
import Controller from './Controller';
import RollupService from '../services/RollupService';

class RollupController extends Controller<RollupService> {
  constructor(service: RollupService) {
    super(service);
    this.verify = this.verify.bind(this);
    this.processTransaction = this.processTransaction.bind(this);
  }

  async verify(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return res.status(200).send({
      valid: await this.service.verify(req.body),
    });
  }

  async processTransaction(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    console.log('RECEIVING ', req.body);
    return res
      .status(200)
      .send(await this.service.processTransaction(req.body));
  }
}

export default RollupController;
