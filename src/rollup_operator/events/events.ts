import { EventEmitter } from 'events';

const emitter = new EventEmitter();

emitter.on('myEvent', (data) => {
  console.log(data, '- FIRST');
});

export default emitter;
