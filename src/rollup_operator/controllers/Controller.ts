import { Service } from '../services/Service';

// generics here save me some time of checking instanceof s ervice
class Controller<S extends Service> {
  service: S;

  constructor(service: S) {
    this.service = service;
  }
}

export default Controller;
