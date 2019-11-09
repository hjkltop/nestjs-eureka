import { DiscoveryService } from './discovery.service';
import { DiscoveryInterceptor } from './discovery.interceptor';
import { TestingModule, Test, TestingModuleBuilder } from '@nestjs/testing';
import { discoveryProviders } from './discovery.provider';
import { EurekaModuleOptions } from '../interfaces/eureka.module.options';
import { EurekaClient, Eureka } from 'eureka-js-client';
import { ServiceDefinition } from '../interfaces/service.definition';
import { EUREKA_MODULE_OPTIONS } from '../client/client.provider';
import { HttpService } from '@nestjs/common';

describe('DiscoveryProvider', () => {
  let module: TestingModuleBuilder;

  let options: EurekaModuleOptions;

  beforeEach(async () => {
    options = {
      eureka: jest.fn() as EurekaClient.EurekaClientConfig,
      service: (jest.fn() as unknown) as ServiceDefinition,
    };

    module = Test.createTestingModule({
      providers: [
        ...discoveryProviders,
        {
          provide: EUREKA_MODULE_OPTIONS,
          useValue: options,
        },
        {
          provide: Eureka,
          useValue: jest.fn(),
        },
        {
          provide: HttpService,
          useValue: jest.fn(),
        },
      ],
    });
  });

  it('should not provide discovery services', async () => {
    options.disableDiscovery = true;

    const app = (await module.compile()).createNestApplication();

    expect(app.get(DiscoveryService)).toBeUndefined();
    expect(app.get(DiscoveryInterceptor)).toBeUndefined();
  });

  it('should provide discovery services', async () => {
    const app = (await module.compile()).createNestApplication();

    expect(app.get(DiscoveryService)).toBeDefined();
    expect(app.get(DiscoveryInterceptor)).toBeDefined();
  });

  it('should provide discovery services - 2', async () => {
    options.disableDiscovery = false;

    const app = (await module.compile()).createNestApplication();

    expect(app.get(DiscoveryService)).toBeDefined();
    expect(app.get(DiscoveryInterceptor)).toBeDefined();
  });
});
