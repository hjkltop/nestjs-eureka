import { Provider } from '@nestjs/common';
import { Eureka } from 'eureka-js-client';
import { EurekaModuleOptions } from '../interfaces/eureka.module.options';
import * as ip from 'ip';
import { ClientLogger } from './client.logger';

const myIp = ip.address();

export const EUREKA_MODULE_OPTIONS = 'EUREKA_MODULE_OPTIONS';

export const eurekaClientProvider: Provider = {
  provide: Eureka,
  useFactory: (options: EurekaModuleOptions): Eureka => {
    if (!options || options.disable) {
      return undefined;
    }
    if (!options.eureka || !options.service) {
      throw new Error('EurekaModuleOptions has no eureka and service options');
    }
    return getEurekaProvider(options);
  },
  inject: [EUREKA_MODULE_OPTIONS],
};

function getEurekaProvider(options: EurekaModuleOptions): Eureka {
  const host = options.service.host || myIp;
  return new Eureka({
    instance: {
      instanceId: `${myIp}:${options.service.name}:${options.service.port}`,
      app: options.service.name,
      hostName: host,
      ipAddr: host,
      port: {
        // prettier-ignore
        '$': options.service.port,
        '@enabled': true,
      },
      vipAddress: options.service.name.toLowerCase(),
      healthCheckUrl: `http://${host}:${options.service.port}/health`,
      homePageUrl: `http://${host}:${options.service.port}/`,
      statusPageUrl: `http://${host}:${options.service.port}/info`,
      dataCenterInfo: {
        // prettier-ignore
        'name': 'MyOwn',
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      },
      metadata: {},
    },
    eureka: options.eureka,
    logger: new ClientLogger(),
  });
}
