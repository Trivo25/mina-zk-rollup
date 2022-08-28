import { CloudAPI, Instance } from './api.js';
import { Provider, Credentials } from './provider.js';

import {
  DescribeInstancesCommand,
  EC2Client,
  RebootInstancesCommand,
  RunInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  TerminateInstancesCommand,
} from '@aws-sdk/client-ec2';

let DryRun = process.env.AWS_DRY_RUN == 'true' ? true : false;

export class AWS extends Provider implements CloudAPI {
  client: EC2Client;

  constructor(c: Credentials | undefined, region: Region = Region.US_EAST_1) {
    super(c);
    this.client = new EC2Client({
      region,
      apiVersion: '2016-11-15',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  async rebootInstance(instanceIds: string[]): Promise<void> {
    var params = {
      InstanceIds: instanceIds,
      DryRun,
    };
    try {
      let res = await this.client.send(new RebootInstancesCommand(params));
      console.log(res);
    } catch (err) {
      console.log('Error', err);
      throw err;
    }
  }

  async listAll(): Promise<Instance[]> {
    var params = {
      DryRun,
    };
    try {
      let instances: any = [];
      let res = await this.client.send(new DescribeInstancesCommand(params));
      res.Reservations?.forEach((res) => {
        res.Instances?.forEach((instance) => {
          instances.push({
            id: instance.InstanceId,
            state: instance.State?.Name,
          });
        });
      });
      console.log(instances);
    } catch (err) {
      console.log('Error', err);
      throw err;
    }
    return [
      {
        id: '',
      },
    ];
  }

  async terminateInstance(instanceIds: string[]): Promise<void> {
    var params = {
      InstanceIds: instanceIds,
      DryRun,
    };
    try {
      let res = await this.client.send(new TerminateInstancesCommand(params));
      console.log(res);
    } catch (err) {
      console.log('Error', err);
      throw err;
    }
  }

  async stopInstances(instanceIds: string[]): Promise<void> {
    var params = {
      InstanceIds: instanceIds,
      DryRun,
    };
    try {
      let res = await this.client.send(new StopInstancesCommand(params));
      console.log(res);
    } catch (err) {
      console.log('Error', err);
      throw err;
    }
  }

  async startInstance(instanceIds: string[]): Promise<void> {
    var params = {
      InstanceIds: instanceIds,
      DryRun,
    };
    try {
      let res = await this.client.send(new StartInstancesCommand(params));
      console.log(res);
    } catch (err) {
      console.log('Error', err);
      throw err;
    }
  }

  async createInstance(instanceType: string = 't2.micro'): Promise<Instance> {
    const instanceParams = {
      ImageId: 'ami-05eeafbc1fd393e9b', //AMI_ID
      InstanceType: instanceType,
      MinCount: 1,
      MaxCount: 1,
      DryRun,
    };
    try {
      const data = await this.client.send(
        new RunInstancesCommand(instanceParams)
      )!;
      console.log(data.Instances![0].InstanceId);
      return {
        id: data.Instances![0].InstanceId!,
      };
    } catch (err) {
      console.log('Error', err);
      throw err;
    }
  }
}

export enum Region {
  US_EAST_1 = 'us-east-1',
}
