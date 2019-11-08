import { Injectable, OnApplicationBootstrap, Logger, OnApplicationShutdown, Optional } from '@nestjs/common';
import { Eureka } from 'eureka-js-client';

@Injectable()
export class RegisterService implements OnApplicationBootstrap, OnApplicationShutdown {
  protected logger: Logger = new Logger(RegisterService.name);

  constructor(@Optional() protected client: Eureka) {}

  async onApplicationBootstrap() {
    if (this.client) {
      // Auto start client
      await new Promise(cb => this.client.start(cb));
    }
  }

  async onApplicationShutdown() {
    if (this.client) {
      await new Promise(cb => this.client.stop(cb));
    }
  }
}
