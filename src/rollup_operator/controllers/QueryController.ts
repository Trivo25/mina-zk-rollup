import express from 'express';
import Controller from './Controller';
import QueryService from '../services/QueryService';
class QueryController extends Controller<QueryService> {
  constructor(service: QueryService) {
    super(service);
    this.getTransactionPool = this.getTransactionPool.bind(this);
    this.getTransactionHistory = this.getTransactionHistory.bind(this);
    this.stats = this.stats.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.getBlocks = this.getBlocks.bind(this);
  }

  async getTransactionPool(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return res.status(200).json(this.service.getTransactionPool());
  }

  async getTransactionHistory(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return res.status(200).json(this.service.getTransactionHistory());
  }

  async getAccounts(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return res.status(200).send(this.service.getAccounts());
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
