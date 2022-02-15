import express from 'express';

import Service from '../services/Service.js';

class Controller {
  service: Service;

  constructor(service: Service) {
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
