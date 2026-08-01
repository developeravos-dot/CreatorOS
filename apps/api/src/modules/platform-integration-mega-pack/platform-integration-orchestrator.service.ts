import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlatformCommandRouterService } from './commands/platform-command-router.service';
import { PlatformDashboardService } from './dashboard/platform-dashboard.service';
import { PlatformEventLedgerService } from './events/platform-event-ledger.service';
import {
  CreatorOSPlatform,
  PlatformCapability,
} from './platform-integration.types';
import { PlatformCapabilityRegistryService } from './registry/platform-capability-registry.service';

@Injectable()
export class PlatformIntegrationOrchestratorService {
  private platform?: CreatorOSPlatform;

  constructor(
    private readonly registry:
      PlatformCapabilityRegistryService,
    private readonly commandRouter:
      PlatformCommandRouterService,
    private readonly ledger:
      PlatformEventLedgerService,
    private readonly dashboardService:
      PlatformDashboardService,
  ) {}

  capabilities() {
    return {
      name:
        'CreatorOS Platform Integration Mega Pack',
      version: 'PI-MP1-1.0.0',
      systems: [
        'Platform Capability Registry',
        'Unified Command Router',
        'Cross-Capability Event Ledger',
        'Unified Platform Dashboard',
        'Human Approval Governance',
        'Platform Health Aggregation',
      ],
      principles: [
        'foundation-first',
        'capability-first',
        'blueprint-driven',
        'human-final-authority',
        'auditable-platform-operations',
      ],
    };
  }

  bootstrap() {
    const now = new Date().toISOString();
    const event = this.ledger.record(
      'CreatorOS Platform',
      'platform-bootstrapped',
    );

    this.platform = {
      id: randomUUID(),
      name: 'CreatorOS',
      version: '1.0.0',
      status:
        'awaiting-human-approval',
      createdAt: now,
      updatedAt: now,
      capabilities:
        this.registry.defaults(),
      commands: [],
      events: [event],
      governance: {
        humanFinalAuthority: false,
        protectedPrinciples: [
          'foundation-first',
          'capability-first',
          'blueprint-driven',
          'human-final-authority',
          'auditable-platform-operations',
        ],
      },
    };

    return this.platform;
  }

  getPlatform() {
    if (!this.platform) {
      return this.bootstrap();
    }

    return this.platform;
  }

  approve(approvedBy: string) {
    const platform = this.getPlatform();
    const event = this.ledger.record(
      approvedBy,
      'platform-approved',
      platform.id,
    );

    platform.status = 'approved';
    platform.updatedAt = event.at;
    platform.governance.humanFinalAuthority =
      true;
    platform.governance.approvedBy =
      approvedBy;
    platform.governance.approvedAt =
      event.at;
    platform.events.push(event);

    return platform;
  }

  activate(actor: string) {
    const platform = this.getPlatform();

    if (
      !platform.governance
        .humanFinalAuthority
    ) {
      throw new Error(
        'Human approval is required before activation.',
      );
    }

    const event = this.ledger.record(
      actor,
      'platform-activated',
      platform.id,
    );

    platform.status = 'active';
    platform.updatedAt = event.at;
    platform.events.push(event);

    return platform;
  }

  registerCapability(
    capability: Omit<
      PlatformCapability,
      'id' | 'status' | 'healthScore'
    >,
    actor: string,
  ) {
    const platform = this.getPlatform();

    const created = this.registry.create(
      capability.key,
      capability.name,
      capability.domain,
      capability.apiRoot,
    );

    created.version =
      capability.version;
    created.dependencies =
      capability.dependencies;
    created.enabled =
      capability.enabled;
    created.metadata =
      capability.metadata;

    this.registry.register(
      platform.capabilities,
      created,
    );

    const event = this.ledger.record(
      actor,
      'capability-registered',
      created.id,
      {
        key: created.key,
      },
    );

    platform.events.push(event);
    platform.updatedAt = event.at;

    return created;
  }

  updateCapabilityHealth(
    key: string,
    score: number,
    actor: string,
  ) {
    const platform = this.getPlatform();
    const capability =
      this.getCapability(
        platform,
        key,
      );

    this.registry.updateHealth(
      capability,
      score,
    );

    if (
      capability.status === 'critical' ||
      capability.status === 'offline'
    ) {
      platform.status = 'degraded';
    }

    const event = this.ledger.record(
      actor,
      'capability-health-updated',
      capability.id,
      {
        key,
        score:
          capability.healthScore,
        status:
          capability.status,
      },
    );

    platform.events.push(event);
    platform.updatedAt = event.at;

    return capability;
  }

  createCommand(
    command: string,
    targetCapability: string,
    payload: Record<string, unknown>,
    riskLevel:
      | 'low'
      | 'medium'
      | 'high'
      | 'critical',
    requestedBy: string,
  ) {
    const platform = this.getPlatform();

    this.getCapability(
      platform,
      targetCapability,
    );

    const request =
      this.commandRouter.create(
        command,
        targetCapability,
        payload,
        riskLevel,
        requestedBy,
      );

    platform.commands.push(request);

    const event = this.ledger.record(
      requestedBy,
      'platform-command-created',
      request.id,
      {
        targetCapability,
        riskLevel,
      },
    );

    platform.events.push(event);
    platform.updatedAt = event.at;

    return request;
  }

  approveCommand(
    commandId: string,
    approvedBy: string,
  ) {
    const platform = this.getPlatform();
    const command =
      platform.commands.find(
        (item) =>
          item.id === commandId,
      );

    if (!command) {
      throw new NotFoundException(
        `Command not found: ${commandId}`,
      );
    }

    this.commandRouter.approve(
      command,
      approvedBy,
    );

    const event = this.ledger.record(
      approvedBy,
      'platform-command-approved',
      command.id,
    );

    platform.events.push(event);
    platform.updatedAt = event.at;

    return command;
  }

  executeCommand(
    commandId: string,
    actor: string,
  ) {
    const platform = this.getPlatform();

    if (platform.status !== 'active') {
      throw new Error(
        'Platform must be active.',
      );
    }

    const command =
      platform.commands.find(
        (item) =>
          item.id === commandId,
      );

    if (!command) {
      throw new NotFoundException(
        `Command not found: ${commandId}`,
      );
    }

    const capability =
      this.getCapability(
        platform,
        command.targetCapability,
      );

    this.commandRouter.execute(
      command,
      capability,
    );

    const event = this.ledger.record(
      actor,
      'platform-command-executed',
      command.id,
      {
        targetCapability:
          command.targetCapability,
      },
    );

    platform.events.push(event);
    platform.updatedAt = event.at;

    return command;
  }

  dashboard() {
    return {
      capabilities:
        this.capabilities(),
      dashboard:
        this.dashboardService.build(
          this.getPlatform(),
        ),
    };
  }

  private getCapability(
    platform: CreatorOSPlatform,
    key: string,
  ) {
    const capability =
      platform.capabilities.find(
        (item) => item.key === key,
      );

    if (!capability) {
      throw new NotFoundException(
        `Capability not found: ${key}`,
      );
    }

    return capability;
  }
}