import Indexer from '../indexer/Indexer';

class Service {
  indexer: typeof Indexer;
  constructor(indexer: typeof Indexer) {
    this.indexer = indexer;
  }
}

export default Service;
