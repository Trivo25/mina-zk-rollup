export interface CloudAPI {
  client: any;

  createInstance(): Promise<Instance>;
  deleteInstance(): Promise<void>;
  listAll(): Promise<Instance[]>;
  stopInstances(): Promise<void>;
  startInstance(): Promise<void>;
}

export interface Instance {
  id: string;
}
