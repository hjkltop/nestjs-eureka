import { Injectable, Logger, Optional } from '@nestjs/common';
import { isNumber } from 'util';
import { EurekaClient, Eureka } from 'eureka-js-client';
import { ServiceDto } from '../interfaces/service';
import * as _ from 'lodash';

@Injectable()
export class DiscoveryService {
  protected logger: Logger = new Logger(DiscoveryService.name);

  constructor(@Optional() protected readonly client: Eureka) {}

  resolveHostname(serviceName: string): ServiceDto {
    if (this.client) {
      const instance = this.getAvailableInstance(serviceName);
      if (instance) {
        this.logger.debug(`Found an instance of ${serviceName} in eureka`);
        const host = instance.hostName;
        const port = this.getPort(instance);
        return {host, port};
      }
      this.logger.debug(`no instance of ${serviceName} found in eureka`);
    }
    return null;
  }

  private getPort(instance: EurekaClient.EurekaInstanceConfig): number {
    if (isNumber(instance.port)) {
      return instance.port;
    } else if (instance.port.hasOwnProperty('enabled') && (instance.port as EurekaClient.PortWrapper).enabled) {
      return (instance.port as EurekaClient.PortWrapper).port;
    } else if (
      instance.port.hasOwnProperty('@enabled') &&
      (instance.port as EurekaClient.LegacyPortWrapper)['@enabled']
    ) {
      return (instance.port as EurekaClient.LegacyPortWrapper).$;
    }
    return 0;
  }

  private getAvailableInstance(serviceName: string): EurekaClient.EurekaInstanceConfig {
    const instances = this.client.getInstancesByAppId(serviceName);
    if (instances && instances.length > 0) {
      return _.find(instances, i => i.status === 'UP');
    }
    return undefined;
  }
}
