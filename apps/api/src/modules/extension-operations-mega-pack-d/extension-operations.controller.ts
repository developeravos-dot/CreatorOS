import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ExtensionOperationsOrchestratorService } from './extension-operations-orchestrator.service';
import { PluginMarketplaceService } from './plugins/plugin-marketplace.service';
import { DeploymentOperationsService } from './operations/deployment-operations.service';
import { EnterpriseDashboardService } from './dashboard/enterprise-dashboard.service';

@Controller('extension/operations')
export class ExtensionOperationsController {
  constructor(
    private readonly orchestrator:
      ExtensionOperationsOrchestratorService,
    private readonly plugins:
      PluginMarketplaceService,
    private readonly operations:
      DeploymentOperationsService,
    private readonly dashboard:
      EnterpriseDashboardService,
  ) {}

  @Post('bootstrap')
  bootstrap() {
    return this.orchestrator.bootstrap();
  }

  @Get('status')
  status() {
    return this.orchestrator.status();
  }

  @Get('plugins')
  listPlugins() {
    return this.plugins.list();
  }

  @Post('deployments')
  deploy(
    @Body()
    body: {
      environment: string;
      version: string;
      services: string[];
    },
  ) {
    return this.orchestrator.deploy(body);
  }

  @Get('deployments')
  listDeployments() {
    return this.operations.listDeployments();
  }

  @Get('runbooks')
  listRunbooks() {
    return this.operations.listRunbooks();
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.refresh();
  }
}