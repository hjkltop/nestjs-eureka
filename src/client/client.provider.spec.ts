import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { eurekaClientProvider } from './client.provider';
import { EurekaModuleOptions } from '../interfaces/eureka.module.options';
import { EurekaClient, Eureka } from 'eureka-js-client';
import { ServiceDefinition } from '../interfaces/service.definition';
import { EUREKA_MODULE_OPTIONS } from './client.provider';

describe('RegisterProvider', () => {
  let module: TestingModuleBuilder;

  let options: EurekaModuleOptions;

  beforeEach(async () => {
    options = {
      eureka: jest.fn() as EurekaClient.EurekaClientConfig,
      service: (jest.fn() as unknown) as ServiceDefinition,
    };

    module = Test.createTestingModule({
      providers: [
        eurekaClientProvider,
        {
          provide: EUREKA_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    });
  });

  it('should not provide eureka client', async () => {
    options.disable = true;

    const app = (await module.compile()).createNestApplication();

    expect(app.get(Eureka)).toBeUndefined();
  });

  it('should provide eureka client', async () => {
    const app = (await module.compile()).createNestApplication();

    expect(app.get(Eureka)).toBeDefined();
  });

  it('should provide eureka client - 2', async () => {
    options.disable = false;

    const app = (await module.compile()).createNestApplication();

    expect(app.get(Eureka)).toBeDefined();
  });
});
