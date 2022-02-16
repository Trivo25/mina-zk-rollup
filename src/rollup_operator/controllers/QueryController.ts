import express from 'express';

import Controller from './Controller';

import QueryService from '../services/QueryService';

class QueryController extends Controller<QueryService> {
  constructor(service: QueryService) {
    super(service);
    this.getTransactionPool = this.getTransactionPool.bind(this);
  }

  async getTransactionPool(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return res.status(200).json(this.service.getTransactionPool());
  }
}

export default new QueryController(new QueryService());
