import Service from '../services/Service';

// generics here save me some time of checking instanceof s ervice
class Controller<ServiceType extends Service> {
  service: ServiceType;

  constructor(service: ServiceType) {
    this.service = service;
  }
}

export default Controller;
