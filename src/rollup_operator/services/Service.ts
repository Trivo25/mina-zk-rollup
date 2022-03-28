import Indexer from '../indexer/Indexer';

class Service {
  indexer: Indexer;
  constructor(indexer: Indexer) {
    this.indexer = indexer;
  }
}

export default Service;
