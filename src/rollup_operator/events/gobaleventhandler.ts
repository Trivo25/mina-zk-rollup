import { EventEmitter } from 'events';

const GlobalEventHandler = new EventEmitter();

GlobalEventHandler.on('myEvent', (data) => {
  console.log(data, '- FIRST');
});

export default GlobalEventHandler;
