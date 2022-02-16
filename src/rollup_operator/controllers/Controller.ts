import express from 'express';

import Service from '../services/Service';

// generics here save me some time of checking instanceof s ervice
class Controller<ServiceType extends Service> {
  service: ServiceType;

  constructor(service: ServiceType) {
    this.service = service;
    this.hello = this.hello.bind(this);
  }

  async hello(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    return res.status(200).send(this.service.hello());
  }
}

export default Controller;
