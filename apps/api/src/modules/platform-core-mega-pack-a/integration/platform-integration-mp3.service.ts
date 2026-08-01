import { Injectable } from '@nestjs/common';
import { CapabilityFabricService } from '../capabilities/capability-fabric.service';
import { PlatformEventBusService } from '../events/platform-event-bus.service';
import { PlatformWorkflowEngineService } from '../workflows/platform-workflow-engine.service';

@Injectable()
export class PlatformIntegrationMp3Service {
  constructor(
    private readonly fabric:
      CapabilityFabricService,
    private readonly eventBus:
      PlatformEventBusService,
    private readonly workflows:
      PlatformWorkflowEngineService,
  ) {}

  status() {
    const capabilities =
      this.fabric.list();
    const workflows =
      this.workflows.list();
    const events =
      this.eventBus.history();

    return {
      name:
        'CreatorOS Platform Core Mega Pack A',
      version: 'PC-MPA-1.0.0',
      status: capabilities.every(
        (item) => item.state === 'active',
      )
        ? 'operational'
        : 'degraded',
      systems: {
        platformIntegrationMp2: true,
        platformIntegrationMp3: true,
        capabilityFabric: true,
        eventBus: true,
        workflowEngine: true,
      },
      metrics: {
        capabilities:
          capabilities.length,
        activeCapabilities:
          capabilities.filter(
            (item) =>
              item.state === 'active',
          ).length,
        workflows:
          workflows.length,
        events: events.length,
      },
      governance: {
        foundationFirst: true,
        capabilityFirst: true,
        blueprintDriven: true,
        humanFinalAuthority: true,
      },
      dependencyGraph:
        this.fabric.graph(),
    };
  }
}