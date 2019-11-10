import { EurekaModule } from './eureka.module';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register/register.service';
import { DiscoveryService } from './discovery/discovery.service';
import { DiscoveryInterceptor } from './discovery/discovery.interceptor';

describe('Eureka Module', () => {
  it('should start module without options', async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EurekaModule.forRoot(undefined)],
    }).compile();

    const app = await moduleFixture.init();
    expect(app.get(RegisterService)).toBeUndefined();
    expect(app.get(DiscoveryService)).toBeUndefined();
    expect(app.get(DiscoveryInterceptor)).toBeUndefined();
  });

  it('should start module without async options', async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EurekaModule.forRootAsync(undefined)],
    }).compile();

    const app = await moduleFixture.init();
    expect(app.get(RegisterService)).toBeUndefined();
    expect(app.get(DiscoveryService)).toBeUndefined();
    expect(app.get(DiscoveryInterceptor)).toBeUndefined();
  });

  it('should start module without options from async options', async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        EurekaModule.forRootAsync({
          useFactory: () => undefined,
        }),
      ],
    }).compile();

    const app = await moduleFixture.init();
    expect(app.get(RegisterService)).toBeUndefined();
    expect(app.get(DiscoveryService)).toBeUndefined();
    expect(app.get(DiscoveryInterceptor)).toBeUndefined();
  });
});
