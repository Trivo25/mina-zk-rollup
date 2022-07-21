/* eslint-disable no-unused-vars */
import Service from './Service';
import {
  ITransaction,
  ISignature,
  EnumError,
  IPublicKey,
} from '../../lib/models';
import {
  Field,
  Poseidon,
  PrivateKey,
  PublicKey,
  Signature,
  UInt32,
  UInt64,
} from 'snarkyjs';
import {
  signatureFromInterface,
  publicKeyFromInterface,
} from '../../lib/helpers';
import {
  RollupProof,
  RollupTransaction,
  RollupDeposit,
  RollupAccount,
} from '../proof_system';
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
  async verify(
    signature: ISignature,
    payload: string[],
    publicKey: IPublicKey
  ): Promise<any> {
    throw new Error('Not implemented');
  }

  async processTransaction(transaction: ITransaction): Promise<any> {
    throw new Error('Not implemented');
  }
}

export default RollupService;
