import {
  Controller,
  Get,
} from '@nestjs/common';

import {
  RuntimeProductionService,
} from './runtime-production.service';

@Controller(
  'enterprise/runtime-production',
)
export class RuntimeProductionController {
  constructor(
    private readonly runtime:
      RuntimeProductionService,
  ) {}

  @Get('status')
  status() {
    return this.runtime.planCapacity({
      activeWorkers: 1,
      concurrencyPerWorker: 10,
      running: 0,
      queued: 0,
      targetUtilization: 0.8,
      maximumStep: 2,
    });
  }
}
