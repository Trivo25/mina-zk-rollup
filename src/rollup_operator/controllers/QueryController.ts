import express from 'express';
import Controller from './Controller';
import QueryService from '../services/QueryService';
import { IPFS_Log, PSQL } from '../indexer/IndexerOptions';
import Indexer from '../indexer/Indexer';
class QueryController extends Controller<QueryService> {
  constructor(service: QueryService) {
    super(service);
    this.getTransactionPool = this.getTransactionPool.bind(this);
    this.stats = this.stats.bind(this);
  }

  async getTransactionPool(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return res.status(200).json(this.service.getTransactionPool());
  }

  async stats(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return res.status(200).json(this.service.stats());
  }
}

export default new QueryController(new QueryService(Indexer));
