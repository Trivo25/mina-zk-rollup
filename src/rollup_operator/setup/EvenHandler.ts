import events from 'events';
import Events from '../interfaces/Events';

class EventHandler {
  static instance: events.EventEmitter | undefined;

  constructor() {
    throw new Error('Use EvenHandler.getInstance() instead!');
  }

  static getInstance() {
    if (EventHandler.instance === undefined) {
      EventHandler.instance = new events.EventEmitter();
      EventHandler.setEvents();
    }
    return EventHandler.instance;
  }

  static setEvents() {
    if (EventHandler.instance === undefined) {
      throw new Error(`Use ${this}.getInstance() instead!`);
    }

    EventHandler.instance.on(Events.PENDING_TRANSACTION_POOL_FULL, () => {
      console.log(
        'The pending transaction stack is full, a rollup block can now be produced'
      );
    });
  }
}

export default EventHandler;
