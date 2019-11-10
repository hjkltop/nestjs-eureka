import { Provider } from '@nestjs/common';
import { EUREKA_MODULE_OPTIONS } from '../client/client.provider';
import { Eureka } from 'eureka-js-client';
import { EurekaModuleOptions } from '../interfaces/eureka.module.options';
import { RegisterService } from './register.service';

export const registerProvider: Provider<RegisterService> = {
  provide: RegisterService,
  useFactory: (client: Eureka, options: EurekaModuleOptions) => {
    if (!options || !client || options.disable) {
      return undefined;
    }
    return new RegisterService(client);
  },
  inject: [Eureka, EUREKA_MODULE_OPTIONS],
};
