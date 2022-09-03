export interface CloudAPI {
  client: any;

  createInstance(amount?: number): Promise<Instance[]>;
  terminateInstance(instances: Instance[]): Promise<void>;
  stopInstances(instances: Instance[]): Promise<void>;
  startInstance(instances: Instance[]): Promise<void>;
  rebootInstance(instances: Instance[]): Promise<void>;
  listAll(instancesId?: Instance[], alive?: string): Promise<Instance[]>;
}

export interface Instance {
  id: string;
  status: string;
  ip: string;
}
