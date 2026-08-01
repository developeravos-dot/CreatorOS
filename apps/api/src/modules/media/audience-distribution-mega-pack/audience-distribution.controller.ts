import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AudienceDistributionOrchestratorService } from './audience-distribution-orchestrator.service';
import { DistributionBrief } from './audience-distribution.types';

@Controller('media/audience-distribution')
export class AudienceDistributionController {
  constructor(
    private readonly orchestrator: AudienceDistributionOrchestratorService,
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
  create(@Body() body: DistributionBrief) {
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

  @Post('programs/:id/metrics')
  updateMetric(
    @Param('id') id: string,
    @Body() body: { metric: string; value: number; actor: string },
  ) {
    return this.orchestrator.updateMetric(
      id,
      body.metric,
      body.value,
      body.actor,
    );
  }

  @Post('programs/:id/learn')
  retainLearning(
    @Param('id') id: string,
    @Body() body: { learning: string; actor: string },
  ) {
    return this.orchestrator.retainLearning(
      id,
      body.learning,
      body.actor,
    );
  }
}