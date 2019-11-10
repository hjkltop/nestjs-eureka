import { RegisterService } from './register.service';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { registerProvider } from './register.provider';
import { EurekaModuleOptions } from '../interfaces/eureka.module.options';
import { EurekaClient, Eureka } from 'eureka-js-client';
import { ServiceDefinition } from '../interfaces/service.definition';
import { EUREKA_MODULE_OPTIONS } from '../client/client.provider';

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
        registerProvider,
        {
          provide: EUREKA_MODULE_OPTIONS,
          useValue: options,
        },
        {
          provide: Eureka,
          useValue: jest.fn(),
        },
      ],
    });
  });

  it('should not provide register services', async () => {
    options.disable = true;

    const app = (await module.compile()).createNestApplication();

    expect(app.get(RegisterService)).toBeUndefined();
  });

  it('should provide register services', async () => {
    const app = (await module.compile()).createNestApplication();

    expect(app.get(RegisterService)).toBeDefined();
  });

  it('should provide register services - 2', async () => {
    options.disable = false;

    const app = (await module.compile()).createNestApplication();

    expect(app.get(RegisterService)).toBeDefined();
  });
});
