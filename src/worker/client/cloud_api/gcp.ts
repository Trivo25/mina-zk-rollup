import { CloudAPI, Instance } from './api.js';
import { Provider, Credentials } from './provider.js';

export class GCP extends Provider implements CloudAPI {
  client: any;

  constructor(c: Credentials) {
    super(c);
  }

  createInstance(): Promise<Instance> {
    throw new Error('Method not implemented.');
  }
  deleteInstance(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  listAll(): Promise<Instance[]> {
    throw new Error('Method not implemented.');
  }
  stopInstances(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  startInstance(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
