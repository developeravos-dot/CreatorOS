import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import {
  EnterpriseOperationsConsoleService,
  EnterpriseResourceManagerService,
} from '../services';

@Controller(
  'enterprise/operations-console',
)
export class EnterpriseOperationsConsoleController {
  constructor(
    private readonly operations:
      EnterpriseOperationsConsoleService,
    private readonly resources:
      EnterpriseResourceManagerService,
  ) {}

  @Get('dashboard')
  dashboard() {
    return this.operations.snapshot();
  }

  @Get('alerts')
  alerts() {
    return this.operations.listAlerts();
  }

  @Post('alerts')
  raiseAlert(
    @Body()
    body: {
      readonly alertId: string;
      readonly severity:
        | 'info'
        | 'warning'
        | 'critical';
      readonly title: string;
      readonly componentId?: string;
    },
  ) {
    return this.operations.raiseAlert(
      body,
    );
  }

  @Get('resources')
  resourceSnapshot() {
    return this.resources.snapshot();
  }
}
