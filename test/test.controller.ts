import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(protected readonly testService: TestService) {}

  @Get()
  get() {
    this.testService.doSomething();
  }
}
