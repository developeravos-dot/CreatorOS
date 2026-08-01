import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MediaIntelligenceCloudService } from './media-intelligence-cloud.service';
import {
  IntelligenceCaseStatus,
  IntelligenceSignalInput,
} from './media-intelligence-cloud.types';

@Controller('media/intelligence-cloud')
export class MediaIntelligenceCloudController {
  constructor(
    private readonly cloud: MediaIntelligenceCloudService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return this.cloud.capabilities();
  }

  @Get('dashboard')
  dashboard() {
    return this.cloud.dashboard();
  }

  @Get('cases')
  list() {
    return this.cloud.list();
  }

  @Get('cases/:id')
  get(@Param('id') id: string) {
    return this.cloud.get(id);
  }

  @Post('cases')
  create(@Body() input: IntelligenceSignalInput) {
    return this.cloud.create(input);
  }

  @Post('cases/:id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.cloud.approve(id, body.approvedBy);
  }

  @Patch('cases/:id/status')
  advance(
    @Param('id') id: string,
    @Body() body: { status: IntelligenceCaseStatus; actor: string },
  ) {
    return this.cloud.advance(id, body.status, body.actor);
  }

  @Post('cases/:id/metrics')
  updateMetric(
    @Param('id') id: string,
    @Body() body: { metric: string; value: number; actor: string },
  ) {
    return this.cloud.updateMetric(
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
    return this.cloud.addLesson(id, body.lesson, body.actor);
  }

  @Post('cases/:id/agents/activate')
  activateAgents(@Param('id') id: string) {
    return this.cloud.activateAgents(id);
  }
}