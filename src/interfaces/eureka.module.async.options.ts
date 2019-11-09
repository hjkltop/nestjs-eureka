import { EurekaModuleOptions } from './eureka.module.options';
import { Type, Abstract } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { EurekaModuleOptionsFactory } from './eureka.module.options.factory';

export interface EurekaModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * The name of the module
   */
  name?: string;
  /**
   * The class which should be used to provide the Eureka options
   */
  useClass?: Type<EurekaModuleOptionsFactory>;
  /**
   * Import existing providers from other module
   */
  useExisting?: Type<EurekaModuleOptionsFactory>;
  /**
   * The factory which should be used to provide the Eureka options
   */
  useFactory?: (...args: any[]) => EurekaModuleOptions | Promise<EurekaModuleOptions>;
  /**
   * The providers which should get injected
   */
  inject?: (string | symbol | Function | Type<any> | Abstract<any>)[];
}
