import { Module } from '@nestjs/common';
import { CapabilityFabricService } from './capabilities/capability-fabric.service';
import { PlatformEventBusService } from './events/platform-event-bus.service';
import { PlatformIntegrationMp2Service } from './integration/platform-integration-mp2.service';
import { PlatformIntegrationMp3Service } from './integration/platform-integration-mp3.service';
import { PlatformCoreController } from './platform-core.controller';
import { PlatformCoreOrchestratorService } from './platform-core-orchestrator.service';
import { PlatformWorkflowEngineService } from './workflows/platform-workflow-engine.service';

@Module({
  controllers: [PlatformCoreController],
  providers: [
    CapabilityFabricService,
    PlatformEventBusService,
    PlatformWorkflowEngineService,
    PlatformIntegrationMp2Service,
    PlatformIntegrationMp3Service,
    PlatformCoreOrchestratorService,
  ],
  exports: [
    CapabilityFabricService,
    PlatformEventBusService,
    PlatformWorkflowEngineService,
    PlatformCoreOrchestratorService,
  ],
})
export class PlatformCoreModule {}