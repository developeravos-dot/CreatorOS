import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { PlatformIntegrationOrchestratorService } from './platform-integration-orchestrator.service';

@Controller('platform')
export class PlatformIntegrationController {
  constructor(
    private readonly orchestrator:
      PlatformIntegrationOrchestratorService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return this.orchestrator.capabilities();
  }

  @Post('bootstrap')
  bootstrap() {
    return this.orchestrator.bootstrap();
  }

  @Get()
  getPlatform() {
    return this.orchestrator.getPlatform();
  }

  @Get('dashboard')
  dashboard() {
    return this.orchestrator.dashboard();
  }

  @Post('approve')
  approve(
    @Body()
    body: {
      approvedBy: string;
    },
  ) {
    return this.orchestrator.approve(
      body.approvedBy,
    );
  }

  @Post('activate')
  activate(
    @Body()
    body: {
      actor: string;
    },
  ) {
    return this.orchestrator.activate(
      body.actor,
    );
  }

  @Post('capabilities')
  registerCapability(
    @Body()
    body: {
      key: string;
      name: string;
      domain: string;
      version: string;
      apiRoot: string;
      dependencies: string[];
      enabled: boolean;
      metadata: Record<
        string,
        unknown
      >;
      actor: string;
    },
  ) {
    return this.orchestrator.registerCapability(
      {
        key: body.key,
        name: body.name,
        domain: body.domain,
        version: body.version,
        apiRoot: body.apiRoot,
        dependencies:
          body.dependencies,
        enabled: body.enabled,
        metadata: body.metadata,
      },
      body.actor,
    );
  }

  @Post(
    'capabilities/:key/health',
  )
  updateCapabilityHealth(
    @Param('key') key: string,
    @Body()
    body: {
      score: number;
      actor: string;
    },
  ) {
    return this.orchestrator.updateCapabilityHealth(
      key,
      body.score,
      body.actor,
    );
  }

  @Post('commands')
  createCommand(
    @Body()
    body: {
      command: string;
      targetCapability: string;
      payload: Record<
        string,
        unknown
      >;
      riskLevel:
        | 'low'
        | 'medium'
        | 'high'
        | 'critical';
      requestedBy: string;
    },
  ) {
    return this.orchestrator.createCommand(
      body.command,
      body.targetCapability,
      body.payload,
      body.riskLevel,
      body.requestedBy,
    );
  }

  @Post(
    'commands/:commandId/approve',
  )
  approveCommand(
    @Param('commandId')
    commandId: string,
    @Body()
    body: {
      approvedBy: string;
    },
  ) {
    return this.orchestrator.approveCommand(
      commandId,
      body.approvedBy,
    );
  }

  @Post(
    'commands/:commandId/execute',
  )
  executeCommand(
    @Param('commandId')
    commandId: string,
    @Body()
    body: {
      actor: string;
    },
  ) {
    return this.orchestrator.executeCommand(
      commandId,
      body.actor,
    );
  }
}