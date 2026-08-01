import { Controller, Get } from '@nestjs/common';
import { CoreService } from './core.service';

@Controller('core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Get('status')
  getStatus() {
    return this.coreService.getStatus();
  }
}
