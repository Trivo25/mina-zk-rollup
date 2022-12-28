import express from 'express';
import { RollupService } from '../services/RollupService.js';
import Controller from './Controller.js';

class RollupController extends Controller<RollupService> {
  constructor(service: RollupService) {
    super(service);
    this.verify = this.verify.bind(this);
    this.processTransaction = this.processTransaction.bind(this);
    this.processDeposit = this.processDeposit.bind(this);
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
    return res
      .status(200)
      .send(await this.service.processTransaction(req.body));
  }

  async processDeposit(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return res.status(200).send(await this.service.processDeposit(req.body));
  }
}

export default RollupController;
