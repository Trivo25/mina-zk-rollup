import { ITransaction } from '../../lib/models';
import Service from './Service';
import { DataStore } from '../data_store';
import { EventEmitter } from 'events';

class QueryService extends Service {
  constructor(store: DataStore, eventHandler: EventEmitter) {
    super(store, eventHandler);
  }

  getTransactionPool(): ITransaction[] {
    return new Array<ITransaction>();
  }

  getAddresses(): any {
    this.eventHandler.emit('myEvent', {
      hey: '123',
    });
    return 'null';
  }

  stats(): any {
    return null;
  }

  getBlocks(): any {
    return null;
  }
}

export default QueryService;
