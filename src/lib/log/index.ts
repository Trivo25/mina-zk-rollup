/* export default pino({
  transport: {
    target: 'pino-pretty',
  },
}); */

export default {
  info(msg: any) {
    console.log(
      '[',
      new Date().toLocaleString(),
      ']',
      '\x1b[36m',
      msg,
      '\x1b[0m'
    );
  },

  log(msg: any) {
    console.log('[', new Date().toLocaleString(), ']', msg);
  },

  error(msg: any) {
    console.log(
      '[',
      new Date().toLocaleString(),
      ']',
      '\x1b[31m',
      msg,
      '\x1b[0m'
    );
  },

  warn(msg: any) {
    console.log(
      '[',
      new Date().toLocaleString(),
      ']',
      '\x1b[33m',
      msg,
      '\x1b[0m'
    );
  },
};
