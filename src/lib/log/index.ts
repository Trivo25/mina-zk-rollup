import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

logger.info('hello world');

logger.error('errpr');
logger.warn({ a: '123' }, 'warn');

export { logger };
