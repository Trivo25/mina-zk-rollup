import Controller from './Controller.js';
import Service from '../services/Service.js';

class PostController extends Controller {
  constructor(service: Service) {
    super(service);
  }
}

export default new PostController(new Service());
