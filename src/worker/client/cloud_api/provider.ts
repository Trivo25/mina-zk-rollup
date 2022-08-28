export class Provider {
  protected c: Credentials | undefined;
  constructor(c: Credentials | undefined) {
    this.c = c;
  }
}

export interface Credentials {
  user: string;
  password: string;
  url: string;
}
