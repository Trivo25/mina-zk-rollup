import { EventEmitter } from 'events';
import { DataStore } from '../data_store/DataStore';

class Service {
  protected store: DataStore;
  protected eventHandler: EventEmitter;
  constructor(store: DataStore, eventHandler: EventEmitter) {
    this.store = store;
    this.eventHandler = eventHandler;
  }
}

export default Service;
