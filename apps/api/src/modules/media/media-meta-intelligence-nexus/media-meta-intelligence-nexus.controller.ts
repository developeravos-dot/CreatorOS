import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MediaMetaIntelligenceNexusService } from './media-meta-intelligence-nexus.service';
import { MetaIntelligenceInput, NexusStatus } from './meta-intelligence.types';

@Controller('media/meta-intelligence-nexus')
export class MediaMetaIntelligenceNexusController {
  constructor(
    private readonly nexus: MediaMetaIntelligenceNexusService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return this.nexus.capabilities();
  }

  @Get('dashboard')
  dashboard() {
    return this.nexus.dashboard();
  }

  @Get('cases')
  list() {
    return this.nexus.list();
  }

  @Get('cases/:id')
  get(@Param('id') id: string) {
    return this.nexus.get(id);
  }

  @Post('cases')
  create(@Body() input: MetaIntelligenceInput) {
    return this.nexus.create(input);
  }

  @Post('cases/:id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.nexus.approve(id, body.approvedBy);
  }

  @Patch('cases/:id/status')
  advance(
    @Param('id') id: string,
    @Body() body: { status: NexusStatus; actor: string },
  ) {
    return this.nexus.advance(id, body.status, body.actor);
  }

  @Post('cases/:id/plan/activate')
  activatePlan(
    @Param('id') id: string,
    @Body() body: { actor: string },
  ) {
    return this.nexus.activatePlan(id, body.actor);
  }

  @Post('cases/:id/experiments/:experimentId/approve')
  approveExperiment(
    @Param('id') id: string,
    @Param('experimentId') experimentId: string,
    @Body() body: { actor: string },
  ) {
    return this.nexus.approveExperiment(id, experimentId, body.actor);
  }

  @Post('cases/:id/experiments/:experimentId/start')
  startExperiment(
    @Param('id') id: string,
    @Param('experimentId') experimentId: string,
    @Body() body: { actor: string },
  ) {
    return this.nexus.startExperiment(id, experimentId, body.actor);
  }

  @Post('cases/:id/experiments/:experimentId/complete')
  completeExperiment(
    @Param('id') id: string,
    @Param('experimentId') experimentId: string,
    @Body() body: { result: number; actor: string },
  ) {
    return this.nexus.completeExperiment(
      id,
      experimentId,
      body.result,
      body.actor,
    );
  }

  @Post('cases/:id/metrics')
  updateMetric(
    @Param('id') id: string,
    @Body() body: { metric: string; value: number; actor: string },
  ) {
    return this.nexus.updateMetric(
      id,
      body.metric,
      body.value,
      body.actor,
    );
  }

  @Post('cases/:id/lessons')
  addLesson(
    @Param('id') id: string,
    @Body() body: { lesson: string; actor: string },
  ) {
    return this.nexus.addLesson(id, body.lesson, body.actor);
  }

  @Post('cases/:id/blockers')
  addBlocker(
    @Param('id') id: string,
    @Body() body: { blocker: string; actor: string },
  ) {
    return this.nexus.addBlocker(id, body.blocker, body.actor);
  }
}