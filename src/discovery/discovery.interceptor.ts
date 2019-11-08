import { OnApplicationBootstrap, HttpService, Logger, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { DiscoveryService } from './discovery.service';

@Injectable()
export class DiscoveryInterceptor implements OnApplicationBootstrap {

  protected logger: Logger = new Logger(DiscoveryInterceptor.name);

  constructor(protected readonly httpService: HttpService,
              protected readonly discoveryService: DiscoveryService) {}

  async onApplicationBootstrap() {
    this.logger.debug('Injecting interceptor');
    this.httpService.axiosRef.interceptors.request.use(this.mapHostnameInterceptor.bind(this));
  }

  private mapHostnameInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
    const url = new URL(config.url, config.baseURL);
    this.logger.debug(`Resolving URL : ${url}`);
    const target = this.discoveryService.resolveHostname(url.hostname);
    if (target) {
      url.hostname = target.host;
      url.port = target.port.toString();
    }
    config.url = url.toJSON();
    return config;
  }
}
