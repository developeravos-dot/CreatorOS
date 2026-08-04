import {
  Controller,
  Get,
} from '@nestjs/common';

import {
  RuntimeObservabilityService,
} from './runtime-observability.service';

@Controller(
  'enterprise/runtime-observability',
)
export class RuntimeObservabilityController {
  constructor(
    private readonly observability:
      RuntimeObservabilityService,
  ) {}

  @Get('dashboard')
  dashboard() {
    return this.observability.dashboard();
  }
}
