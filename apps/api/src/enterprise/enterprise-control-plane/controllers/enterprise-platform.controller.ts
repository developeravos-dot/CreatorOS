import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import {
  EnterpriseAuditLedgerService,
  EnterpriseEventBusService,
  EnterpriseGlobalSchedulerService,
  EnterprisePlatformOrchestratorService,
} from '../services';

@Controller(
  'enterprise/platform',
)
export class EnterprisePlatformController {
  constructor(
    private readonly orchestrator:
      EnterprisePlatformOrchestratorService,
    private readonly scheduler:
      EnterpriseGlobalSchedulerService,
    private readonly events:
      EnterpriseEventBusService,
    private readonly audit:
      EnterpriseAuditLedgerService,
  ) {}

  @Get('snapshot')
  snapshot() {
    return this.orchestrator.snapshot();
  }

  @Get('events')
  eventLog() {
    return this.events.query();
  }

  @Get('audit')
  auditLog() {
    return this.audit.query();
  }

  @Post('tasks')
  schedule(
    @Body()
    body: {
      readonly taskId: string;
      readonly type: string;
      readonly priority: number;
      readonly dueAt: string;
    },
  ) {
    return this.scheduler.schedule({
      ...body,
      dueAt: new Date(
        body.dueAt,
      ),
    });
  }
}
