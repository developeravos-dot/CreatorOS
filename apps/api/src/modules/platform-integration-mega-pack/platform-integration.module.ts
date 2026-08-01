import { Module } from '@nestjs/common';
import { PlatformCommandRouterService } from './commands/platform-command-router.service';
import { PlatformDashboardService } from './dashboard/platform-dashboard.service';
import { PlatformEventLedgerService } from './events/platform-event-ledger.service';
import { PlatformCapabilityRegistryService } from './registry/platform-capability-registry.service';
import { PlatformIntegrationController } from './platform-integration.controller';
import { PlatformIntegrationOrchestratorService } from './platform-integration-orchestrator.service';

@Module({
  controllers: [
    PlatformIntegrationController,
  ],
  providers: [
    PlatformCapabilityRegistryService,
    PlatformCommandRouterService,
    PlatformEventLedgerService,
    PlatformDashboardService,
    PlatformIntegrationOrchestratorService,
  ],
  exports: [
    PlatformIntegrationOrchestratorService,
  ],
})
export class PlatformIntegrationModule {}