import { Module, DynamicModule, HttpModule, Provider, Type } from '@nestjs/common';
import { eurekaClientProvider, EUREKA_MODULE_OPTIONS } from './client/client.provider';
import { RegisterService } from './register/register.service';
import { EurekaModuleOptions } from './interfaces/eureka.module.options';
import { DiscoveryService } from './discovery/discovery.service';
import { EurekaModuleAsyncOptions } from './interfaces/eureka.module.async.options';
import { EurekaModuleOptionsFactory } from './interfaces/eureka.module.options.factory';
import { DiscoveryInterceptor } from './discovery/discovery.interceptor';

@Module({
  imports: [HttpModule],
  providers: [eurekaClientProvider, RegisterService, DiscoveryService, DiscoveryInterceptor],
  exports: [RegisterService, HttpModule],
})
export class EurekaModule {
  static forRoot(options: EurekaModuleOptions): DynamicModule {
    return {
      module: EurekaModule,
      providers: [EurekaModule.createProvider(options)],
    };
  }

  static forRootAsync(asyncOptions: EurekaModuleAsyncOptions): DynamicModule {
    return {
      module: EurekaModule,
      providers: [EurekaModule.createAsyncProvider(asyncOptions)],
    };
  }

  private static createProvider(config: EurekaModuleOptions): Provider<EurekaModuleOptions> {
    return {
      provide: EUREKA_MODULE_OPTIONS,
      useValue: config,
    };
  }

  private static createAsyncProvider(
    options: EurekaModuleAsyncOptions,
  ): Provider<EurekaModuleOptions | Promise<EurekaModuleOptions>> {
    if (options.useFactory) {
      return {
        provide: EUREKA_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    if (options.useClass || options.useExisting) {
      // Bug with TypeScript 3.5.2: https://github.com/microsoft/TypeScript/issues/31937
      const inject = [(options.useClass || options.useExisting) as Type<EurekaModuleOptionsFactory>];
      return {
        provide: EUREKA_MODULE_OPTIONS,
        useFactory: async (optionsFactory: EurekaModuleOptionsFactory) => await optionsFactory.createEurekaOptions(),
        inject,
      };
    }

    throw new Error();
  }
}
