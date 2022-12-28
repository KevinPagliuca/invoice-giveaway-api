import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core/controller.decorator';

@Controller()
export class ApiController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
