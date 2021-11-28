import { Test, TestingModule } from '@nestjs/testing';
import { EurekaModule } from '../src';
import { TestController } from './test.controller';
import { INestApplication } from '@nestjs/common';
import { TestService } from './test.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

jest.mock('./test.service');
jest.setTimeout(90000);

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;
  let mockedService: TestService;

  beforeEach(async () => {
    mockedService = new TestService();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        EurekaModule.forRoot({
          eureka: {
            host: process.env.GITLAB_CI ? 'eureka-service' : '127.0.0.1',
            port: 8761,
            registryFetchInterval: 1000,
            servicePath: '/eureka/apps/',
            maxRetries: 3,
          },
          service: {
            name: 'test-service',
            port: 8080,
          },
        }),
      ],
      controllers: [TestController],
      providers: [
        {
          provide: TestService,
          useValue: mockedService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    await app.init();
    app.listen(8080);
    httpService = app.get(HttpService);

    // Wait eureka registry fetch.
    await new Promise(resolve => setTimeout(resolve, 5000));
  });

  it('should resolve dns with eureka', async () => {
    await firstValueFrom(httpService.get('http://test-service/test'));
    expect(mockedService.doSomething).toBeCalled();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
