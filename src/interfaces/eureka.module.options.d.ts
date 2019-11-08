import { EurekaClient } from 'eureka-js-client';
import { ServiceDefinition } from "./service.definition";

export interface EurekaModuleOptions {
  eureka: EurekaClient.EurekaClientConfig;
  service: ServiceDefinition;
}
