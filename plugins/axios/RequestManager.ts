import { Canceler } from 'axios';

export type RequestManagerOptions = {
  debug?: Boolean;
  logger?: (...args: any[]) => any;
};

export class RequestManager {
  requests: Map<string, Canceler>;

  constructor(
    public options: RequestManagerOptions = { debug: process.env.NODE_ENV === 'development', logger: console.log }
  ) {
    this.requests = new Map();
  }

  add(requestId: string, cancelFn: Canceler) {
    this.log(`Adding request '${requestId}'`);

    if (this.requests.has(requestId)) {
      this.cancel(requestId, `Duplicate request '${requestId}', cancelling...`);
    }

    this.requests.set(requestId, cancelFn);
  }

  remove(requestId: string) {
    this.log(`Removing request '${requestId}'`);
    this.requests.delete(requestId);
  }

  cancel(requestId: string, reason: string = `Request '${requestId}' cancelled`) {
    if (this.requests.has(requestId)) {
      this.requests.get(requestId)(reason);
      this.remove(requestId);
      this.log(`Request '${requestId}' cancelled`);
    }
  }

  cancelAll(reason: string) {
    this.requests.forEach((cancelFn, key) => {
      cancelFn(reason);
      this.remove(key);
      this.log(`Request '${key}' cancelled`);
    });
  }

  log(message: string) {
    const { debug, logger } = this.options;
    const prefix = '[RequestManager]: ';

    if (debug) {
      logger(`${prefix}${message}`);
    }
  }
}
