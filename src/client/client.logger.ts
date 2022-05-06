import { Eureka } from 'eureka-js-client';
import { Logger, LoggerService } from '@nestjs/common';

export class ClientLogger {
  protected logger: LoggerService;

  constructor(logger?: LoggerService) {
    this.logger = logger || new Logger(Eureka.name)
  }

  warn(...args: any[]): void {
    this.callLogger('warn', args);
  }
  info(...args: any[]): void {
    this.callLogger('log', args);
  }
  debug(...args: any[]): void {
    this.callLogger('debug', args);
  }
  error(...args: any[]): void {
    this.callLogger('error', args);
  }

  private callLogger(level: 'warn' | 'log' | 'debug' | 'error', args: any[]) {
    this.logger[level](args.join(' '));
  }
}
