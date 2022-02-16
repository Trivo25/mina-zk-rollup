import pkg from 'pg';

class SingletonPool extends pkg.Pool {
  constructor() {
    super({
      user: process.env.PSQL_user,
      database: process.env.PSQL_database,
      password: process.env.PSQL_password,
      port: parseInt(process.env.PSQL_port!),
      host: process.env.PSQL_host,
    });
  }
}

class Connection {
  static instance: SingletonPool | undefined;

  constructor() {
    throw new Error(`Use ${this}.getInstance() instead!`);
  }

  static getInstance() {
    if (Connection.instance === undefined) {
      Connection.instance = new SingletonPool();
    }
    return Connection.instance;
  }
}

export default Connection;
