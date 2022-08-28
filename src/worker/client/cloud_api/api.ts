export interface CloudAPI {
  client: any;

  createInstance(): Promise<Instance>;
  terminateInstance(instanceIds: string[]): Promise<void>;
  stopInstances(instanceIds: string[]): Promise<void>;
  startInstance(instanceIds: string[]): Promise<void>;
  rebootInstance(instanceIds: string[]): Promise<void>;
  listAll(): Promise<Instance[]>;
}

export interface Instance {
  id: string;
}
