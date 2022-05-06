import { EurekaClient } from 'eureka-js-client';
import { ServiceDefinition } from './service.definition';
import { LoggerService } from '@nestjs/common';
export interface EurekaModuleOptions {
  requestMiddleware?: ((requestOpts: any, done: (opts: any) => void) => void) | undefined;
  eureka?: EurekaClient.EurekaClientConfig;
  service?: ServiceDefinition;
  disableDiscovery?: boolean;
  disable?: boolean;
  logger?: LoggerService;
}
