import {
  Injectable,
} from '@nestjs/common';

import {
  EnterpriseAiOrganizationService,
} from './enterprise-ai-organization.service';
import {
  EnterpriseAuditLedgerService,
} from './enterprise-audit-ledger.service';
import {
  EnterpriseControlPlaneService,
} from './enterprise-control-plane.service';
import {
  EnterpriseEventBusService,
} from './enterprise-event-bus.service';
import {
  EnterpriseGlobalSchedulerService,
} from './enterprise-global-scheduler.service';
import {
  EnterpriseOperationsConsoleService,
} from './enterprise-operations-console.service';

@Injectable()
export class EnterprisePlatformOrchestratorService {
  constructor(
    private readonly controlPlane:
      EnterpriseControlPlaneService,
    private readonly operations:
      EnterpriseOperationsConsoleService,
    private readonly organization:
      EnterpriseAiOrganizationService,
    private readonly scheduler:
      EnterpriseGlobalSchedulerService,
    private readonly events:
      EnterpriseEventBusService,
    private readonly audit:
      EnterpriseAuditLedgerService,
  ) {}

  snapshot() {
    return {
      controlPlane:
        this.controlPlane.snapshot(),
      operations:
        this.operations.snapshot(),
      aiOrganization:
        this.organization.snapshot(),
      scheduledTasks:
        this.scheduler.snapshot(),
      events:
        this.events.query(),
      auditRecords:
        this.audit.query(),
      generatedAt: new Date(),
    };
  }

  executeScheduledTask(input: {
    readonly taskId: string;
    readonly actor: string;
    readonly now?: Date;
  }) {
    const task =
      this.scheduler.transition(
        input.taskId,
        'running',
      );

    const event =
      this.events.publish({
        eventId:
          `event-${task.taskId}-started`,
        type:
          'enterprise.task.started',
        source:
          'enterprise-platform-orchestrator',
        payload: {
          taskId: task.taskId,
          taskType: task.type,
        },
        now: input.now,
      });

    const audit =
      this.audit.record({
        auditId:
          `audit-${task.taskId}-started`,
        actor: input.actor,
        action:
          'enterprise.task.start',
        resource: task.taskId,
        metadata: {
          taskType: task.type,
        },
        now: input.now,
      });

    return {
      task,
      event,
      audit,
    };
  }
}
