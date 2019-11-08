import { Eureka } from 'eureka-js-client';
import { Logger } from '@nestjs/common';

export class ClientLogger {
  protected logger = new Logger(Eureka.name);

  warn(...args: any[]): void {
    this.logger.warn.apply(this.logger, args);
  }
  info(...args: any[]): void {
    this.logger.log.apply(this.logger, args);
  }
  debug(...args: any[]): void {
    this.logger.debug.apply(this.logger, args);
  }
  error(...args: any[]): void {
    this.logger.error.apply(this.logger, args);
  }
}
