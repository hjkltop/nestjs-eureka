import { OnApplicationBootstrap, HttpService, Logger, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { DiscoveryService } from './discovery.service';

@Injectable()
export class DiscoveryInterceptor implements OnApplicationBootstrap, OnApplicationShutdown {
  protected logger: Logger = new Logger(DiscoveryInterceptor.name);

  private interceptorNumber: number;

  constructor(protected readonly httpService: HttpService, protected readonly discoveryService: DiscoveryService) {}

  onApplicationBootstrap() {
    this.logger.debug('Injecting interceptor');
    this.interceptorNumber = this.httpService.axiosRef.interceptors.request.use(this.mapHostnameInterceptor.bind(this));
  }

  onApplicationShutdown() {
    this.logger.debug('Eject interceptor');
    this.httpService.axiosRef.interceptors.request.eject(this.interceptorNumber);
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
