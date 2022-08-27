export class Provider {
  protected c: Credentials;
  constructor(c: Credentials) {
    this.c = c;
  }
}

export interface Credentials {
  user: string;
  password: string;
  url: string;
}
