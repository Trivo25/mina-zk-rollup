export interface CloudAPI {
  client: any;

  createInstance(): Promise<Instance>;
  terminateInstance(instances: Instance[]): Promise<void>;
  stopInstances(instances: Instance[]): Promise<void>;
  startInstance(instances: Instance[]): Promise<void>;
  rebootInstance(instances: Instance[]): Promise<void>;
  listAll(): Promise<Instance[]>;
}

export interface Instance {
  id: string;
  status: string;
  ip: string;
}
