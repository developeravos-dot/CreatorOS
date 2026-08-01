import { Controller, Get } from '@nestjs/common';
import { PlatformStatusService } from './platform-status.service';

@Controller('platform')
export class PlatformStatusController {
  constructor(
    private readonly platformStatusService: PlatformStatusService,
  ) {}

  @Get('status')
  getStatus() {
    return this.platformStatusService.getStatus();
  }
}
