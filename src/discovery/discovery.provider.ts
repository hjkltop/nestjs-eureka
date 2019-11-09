import { Provider, HttpService } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { DiscoveryInterceptor } from './discovery.interceptor';
import { EUREKA_MODULE_OPTIONS } from '../client/client.provider';
import { Eureka } from 'eureka-js-client';
import { EurekaModuleOptions } from '../interfaces/eureka.module.options';

const discoveryServiceProvider: Provider<DiscoveryService> = {
  provide: DiscoveryService,
  useFactory: (client: Eureka, options: EurekaModuleOptions) => {
    return options.disableDiscovery ? undefined : new DiscoveryService(client);
  },
  inject: [Eureka, EUREKA_MODULE_OPTIONS],
};

const discoveryInterceptorProvider: Provider<DiscoveryInterceptor> = {
  provide: DiscoveryInterceptor,
  useFactory: (httpService: HttpService, discoveryService: DiscoveryService, options: EurekaModuleOptions) => {
    return options.disableDiscovery ? undefined : new DiscoveryInterceptor(httpService, discoveryService);
  },
  inject: [HttpService, DiscoveryService, EUREKA_MODULE_OPTIONS],
};

export const discoveryProviders: Provider[] = [discoveryServiceProvider, discoveryInterceptorProvider];
