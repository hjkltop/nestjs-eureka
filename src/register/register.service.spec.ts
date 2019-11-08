import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import { Eureka } from 'eureka-js-client';
import { INestApplication } from '@nestjs/common';

// Mock Eureka js client
jest.mock('eureka-js-client');

describe('EurekaService', () => {
  let service: RegisterService;
  let mockedClient: Eureka;
  let app: INestApplication;

  beforeEach(async () => {
    mockedClient = new Eureka(null);
    jest.spyOn(mockedClient, 'start').mockImplementation(cb => {
      cb(null);
    });
    jest.spyOn(mockedClient, 'stop').mockImplementation(cb => {
      cb(null);
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: Eureka,
          useValue: mockedClient,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    service = app.get(RegisterService);
  });

  it('should be defined and start eureka client', () => {
    expect(service).toBeDefined();

    expect(mockedClient.start).toHaveBeenCalledTimes(1);
  });

  it('should stop eureka client', async () => {
    await app.close();
    app = undefined;

    expect(mockedClient.stop).toHaveBeenCalledTimes(1);
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
/*
it('should get an app instance from eureka', async () => {
  jest.spyOn(mockedClient, 'getInstancesByAppId')
      .mockReturnValue([mockEurekaInstanceConfig('DOWN'), mockEurekaInstanceConfig('UP')]);

  const instance = service.getAvailableInstance('app');

  expect(instance).toBeDefined();
  expect(instance.app).toEqual('app');
});

it('should not get find app in eureka', async () => {
  jest.spyOn(mockedClient, 'getInstancesByAppId').mockReturnValue(undefined);

  const instance = service.getAvailableInstance('not_found');

  expect(instance).toBeUndefined();
});
function mockEurekaInstanceConfig(status: EurekaClient.InstanceStatus): EurekaClient.EurekaInstanceConfig {
  return {
    app: 'app',
    hostName: 'hostname2',
    ipAddr: 'ipAddr2',
    vipAddress: 'vipAddress2',
    dataCenterInfo: {
      name: 'MyOwn',
    },
    status,
  };
}*/
