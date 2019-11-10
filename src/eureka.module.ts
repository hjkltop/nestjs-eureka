import { Module, DynamicModule, HttpModule, Provider, Type } from '@nestjs/common';
import { eurekaClientProvider, EUREKA_MODULE_OPTIONS } from './client/client.provider';
import { EurekaModuleOptions } from './interfaces/eureka.module.options';
import { EurekaModuleAsyncOptions } from './interfaces/eureka.module.async.options';
import { EurekaModuleOptionsFactory } from './interfaces/eureka.module.options.factory';
import { discoveryProviders } from './discovery/discovery.provider';
import { registerProvider } from './register/register.provider';

const DEFAULT_OPTIONS: EurekaModuleOptions = { disable: true };
const DEFAULT_ASYNC_OPTIONS: EurekaModuleAsyncOptions = { useFactory: () => DEFAULT_OPTIONS };

@Module({
  imports: [HttpModule],
  providers: [eurekaClientProvider, ...discoveryProviders, registerProvider],
  exports: [HttpModule],
})
export class EurekaModule {
  static forRoot(options: EurekaModuleOptions): DynamicModule {
    return {
      module: EurekaModule,
      providers: [EurekaModule.createProvider(options || DEFAULT_OPTIONS)],
    };
  }

  static forRootAsync(asyncOptions: EurekaModuleAsyncOptions): DynamicModule {
    return {
      module: EurekaModule,
      providers: [EurekaModule.createAsyncProvider(asyncOptions || DEFAULT_ASYNC_OPTIONS)],
    };
  }

  private static createProvider(options: EurekaModuleOptions): Provider<EurekaModuleOptions> {
    return {
      provide: EUREKA_MODULE_OPTIONS,
      useValue: options,
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
