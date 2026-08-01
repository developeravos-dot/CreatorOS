import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { IntelligenceCoreOrchestratorService } from './intelligence-core-orchestrator.service';
import { KnowledgeFabricService } from './knowledge/knowledge-fabric.service';
import { DataFabricService } from './data/data-fabric.service';
import { AiAgentRuntimeService } from './agents/ai-agent-runtime.service';
import { AiOrganizationOsService } from './organization/ai-organization-os.service';

@Controller('intelligence/core')
export class IntelligenceCoreController {
  constructor(
    private readonly orchestrator:
      IntelligenceCoreOrchestratorService,
    private readonly knowledge:
      KnowledgeFabricService,
    private readonly data:
      DataFabricService,
    private readonly runtime:
      AiAgentRuntimeService,
    private readonly organization:
      AiOrganizationOsService,
  ) {}

  @Post('bootstrap')
  bootstrap() {
    return this.orchestrator.bootstrap();
  }

  @Get('status')
  status() {
    return this.orchestrator.status();
  }

  @Get('knowledge')
  listKnowledge() {
    return this.knowledge.list();
  }

  @Get('data-assets')
  listDataAssets() {
    return this.data.list();
  }

  @Get('agents')
  listAgents() {
    return this.runtime.listAgents();
  }

  @Get('teams')
  listTeams() {
    return this.organization.listTeams();
  }

  @Post('council/mission')
  runCouncilMission(
    @Body()
    body: {
      objective: string;
      context?: Record<string, unknown>;
    },
  ) {
    return this.orchestrator.runCouncilMission(
      body,
    );
  }
}