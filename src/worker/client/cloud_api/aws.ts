import { CloudAPI, Instance } from './api.js';
import { Provider, Credentials } from './provider.js';

import {
  EC2Client,
  AcceptReservedInstancesExchangeQuoteCommand,
  AcceptReservedInstancesExchangeQuoteCommandInput,
} from '@aws-sdk/client-ec2';

export class AWS extends Provider implements CloudAPI {
  client: EC2Client;

  constructor(c: Credentials) {
    super(c);
    this.client = new EC2Client({ region: 'REGION' });
  }

  async createInstance(): Promise<Instance> {
    const params: AcceptReservedInstancesExchangeQuoteCommandInput = {
      ReservedInstanceIds: undefined,
    };
    const command = new AcceptReservedInstancesExchangeQuoteCommand(params);

    this.client.send(command, (err: Error, data: any) => {
      console.log(err);
      console.log(data);
    });

    return {
      id: '',
    };
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
