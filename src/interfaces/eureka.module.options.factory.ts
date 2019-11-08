import { EurekaModuleOptions } from './eureka.module.options';

export interface EurekaModuleOptionsFactory {
  /**
   * The function which returns the Terminus Options
   */
  createEurekaOptions(): Promise<EurekaModuleOptions> | EurekaModuleOptions;
}
