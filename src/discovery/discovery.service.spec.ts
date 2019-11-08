import { Test, TestingModule } from '@nestjs/testing';
import { Eureka, EurekaClient } from 'eureka-js-client';
import { DiscoveryService } from './discovery.service';

// Mock Eureka js client
jest.mock('eureka-js-client');

describe('EurekaService', () => {
  let service: DiscoveryService;
  let mockedClient: Eureka;

  beforeEach(async () => {
    mockedClient = new Eureka(null);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscoveryService,
        {
          provide: Eureka,
          useValue: mockedClient,
        },
      ],
    }).compile();

    const app = module.createNestApplication();
    service = app.get(DiscoveryService);
  });

  it('should get an app instance from eureka', async () => {
    jest
      .spyOn(mockedClient, 'getInstancesByAppId')
      .mockReturnValue([mockEurekaInstanceConfig('DOWN'), mockEurekaInstanceConfig('UP')]);

    const serviceDto = service.resolveHostname('app-service');

    expect(serviceDto).toBeDefined();
    expect(serviceDto.host).toEqual('hostname-UP');
    expect(serviceDto.port).toEqual(8080);
  });

  it('should not get find app in eureka', async () => {
    jest.spyOn(mockedClient, 'getInstancesByAppId').mockReturnValue(undefined);

    const serviceDto = service.resolveHostname('not_found');

    expect(serviceDto).toBeNull();
  });
});

function mockEurekaInstanceConfig(status: EurekaClient.InstanceStatus): EurekaClient.EurekaInstanceConfig {
  return {
    app: 'app-service',
    hostName: 'hostname-' + status,
    ipAddr: 'ipAddr2',
    vipAddress: 'vipAddress2',
    dataCenterInfo: {
      // prettier-ignore
      'name': 'MyOwn',
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
    },
    port: {
      // prettier-ignore
      '$': 8080,
      '@enabled': true,
    },
    status,
  };
}
