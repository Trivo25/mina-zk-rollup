/* eslint-disable no-unused-vars */
import Service from './Service';
import { ITransaction, EnumError } from '../../lib/models';
import { DataStore } from '../data_store';
import { base58Encode, sha256 } from '../../lib/helpers';
import SequencerEvents from '../events/events';
import { EventEmitter } from 'events';

class RollupService extends Service {
  constructor(store: DataStore, eventHandler: EventEmitter) {
    super(store, eventHandler);
  }

  async produceRollupBlock() {
    throw new Error('Not implemented');
  }

  /**
   * Verifies a signature
   * @param signature Signature to verify
   * @returns true if signature is valid
   */
  async verify(payload: string[]): Promise<any> {
    throw new Error('Not implemented');
  }

  async processTransaction(transaction: ITransaction): Promise<any> {
    throw new Error('Not implemented');
  }
}

export default RollupService;
