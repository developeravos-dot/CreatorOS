import { Injectable } from '@nestjs/common';
import { RegistryService } from '../registry/registry.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { WorkflowService } from '../workflow/workflow.service';
import { MessagingService } from '../messaging/messaging.service';
import { RuntimeService } from '../runtime/runtime.service';
import { BlueprintService } from '../blueprint/blueprint.service';

@Injectable()
export class PlatformStatusService {
  constructor(
    private readonly registryService:
      RegistryService,
    private readonly eventBusService:
      EventBusService,
    private readonly knowledgeService:
      KnowledgeService,
    private readonly workflowService:
      WorkflowService,
    private readonly messagingService:
      MessagingService,
    private readonly runtimeService:
      RuntimeService,
  ) {}

  getStatus() {
    return {
      platform: {
        name: 'CreatorOS / AVOS',
        version: '0.3.0',
        status: 'operational',
      },
      phase: {
        id: 'PHASE-3.0',
        name: 'Blueprint Engine Mega Pack',
        status: 'operational',
      },
      registry:
        this.registryService
          .getSummary(),
      eventBus:
        this.eventBusService
          .getStatus(),
      knowledge:
        this.knowledgeService
          .getStatus(),
      workflow:
        this.workflowService
          .getStatus(),
      messaging:
        this.messagingService
          .getStatus(),
      runtime:
        this.runtimeService
          .getHealth(),
      governance: {
        foundationFirst: true,
        capabilityFirst: true,
        blueprintDriven: true,
        humanFinalAuthority: true,
      },
      timestamp:
        new Date().toISOString(),
    };
  }
}

