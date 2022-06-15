import express from 'express';
import Controller from './Controller';
import QueryService from '../services/QueryService';
class QueryController extends Controller<QueryService> {
  constructor(service: QueryService) {
    super(service);
    this.getTransactionPool = this.getTransactionPool.bind(this);
    this.stats = this.stats.bind(this);
    this.getAddresses = this.getAddresses.bind(this);
    this.getBlocks = this.getBlocks.bind(this);
  }

  async getTransactionPool(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return res.status(200).json(this.service.getTransactionPool());
  }

  async getAddresses(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return res.status(200).send(this.service.getAddresses());
  }

  async getBlocks(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return res.status(200).send(this.service.getBlocks());
  }
  async stats(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return res.status(200).json(this.service.stats());
  }
}

export default QueryController;
