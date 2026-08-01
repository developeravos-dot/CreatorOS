import { Module } from '@nestjs/common';
import { PluginMarketplaceService } from './plugins/plugin-marketplace.service';
import { DeploymentOperationsService } from './operations/deployment-operations.service';
import { EnterpriseDashboardService } from './dashboard/enterprise-dashboard.service';
import { ExtensionOperationsOrchestratorService } from './extension-operations-orchestrator.service';
import { ExtensionOperationsController } from './extension-operations.controller';

@Module({
  controllers: [
    ExtensionOperationsController,
  ],
  providers: [
    PluginMarketplaceService,
    DeploymentOperationsService,
    EnterpriseDashboardService,
    ExtensionOperationsOrchestratorService,
  ],
  exports: [
    PluginMarketplaceService,
    DeploymentOperationsService,
    EnterpriseDashboardService,
    ExtensionOperationsOrchestratorService,
  ],
})
export class ExtensionOperationsModule {}