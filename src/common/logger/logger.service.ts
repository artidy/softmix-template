import 'reflect-metadata';
import {injectable} from 'inversify';
import pino, {Logger} from 'pino';

import {LoggerInterface} from './logger.interface.js';

@injectable()
class LoggerService implements LoggerInterface {
  private logger!: Logger;

  constructor() {
    this.logger = pino();
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, args);
  }

  public error(message: string, ...args: unknown[]): void {
    this.logger.error(message, args);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, args);
  }
}

export default LoggerService;
