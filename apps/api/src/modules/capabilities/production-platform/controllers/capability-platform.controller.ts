import {
  Controller,
  Get,
} from '@nestjs/common';

import {
  CapabilityPlatformService,
} from '../services';

@Controller('capability-platform')
export class CapabilityPlatformController {
  constructor(
    private readonly platform:
      CapabilityPlatformService,
  ) {}

  @Get('status')
  status() {
    return this.platform.status();
  }

  @Get('health')
  health() {
    return this.platform.health();
  }

  @Get('metrics')
  metrics() {
    return this.platform.metrics();
  }

  @Get('audit')
  audit() {
    return this.platform.auditRecords();
  }
}