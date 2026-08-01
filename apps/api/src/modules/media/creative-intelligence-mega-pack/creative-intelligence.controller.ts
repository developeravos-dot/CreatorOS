import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreativeIntelligenceOrchestratorService } from './creative-intelligence-orchestrator.service';
import { CreativeProjectBrief } from './creative-intelligence.types';

@Controller('media/creative-intelligence')
export class CreativeIntelligenceController {
  constructor(
    private readonly orchestrator: CreativeIntelligenceOrchestratorService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return this.orchestrator.capabilities();
  }

  @Get('dashboard')
  dashboard() {
    return this.orchestrator.dashboard();
  }

  @Post('programs')
  create(@Body() body: CreativeProjectBrief) {
    return this.orchestrator.create(body);
  }

  @Get('programs')
  list() {
    return this.orchestrator.list();
  }

  @Get('programs/:id')
  get(@Param('id') id: string) {
    return this.orchestrator.get(id);
  }

  @Post('programs/:id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.orchestrator.approve(id, body.approvedBy);
  }

  @Post('programs/:id/activate')
  activate(
    @Param('id') id: string,
    @Body() body: { actor: string },
  ) {
    return this.orchestrator.activate(id, body.actor);
  }

  @Post('programs/:id/complete')
  complete(
    @Param('id') id: string,
    @Body() body: { actor: string },
  ) {
    return this.orchestrator.complete(id, body.actor);
  }
}