import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MediaAutonomousEnterprisePlatformService } from './media-autonomous-enterprise-platform.service';
import {
  AutonomousInitiativeInput,
  InitiativeStatus,
} from './media-autonomous-enterprise.types';

@Controller('media/autonomous-enterprise')
export class MediaAutonomousEnterprisePlatformController {
  constructor(
    private readonly platform: MediaAutonomousEnterprisePlatformService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return this.platform.capabilities();
  }

  @Get('dashboard')
  dashboard() {
    return this.platform.dashboard();
  }

  @Get('initiatives')
  list() {
    return this.platform.list();
  }

  @Get('initiatives/:id')
  get(@Param('id') id: string) {
    return this.platform.get(id);
  }

  @Post('initiatives')
  create(@Body() input: AutonomousInitiativeInput) {
    return this.platform.create(input);
  }

  @Post('initiatives/:id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.platform.approve(id, body.approvedBy);
  }

  @Patch('initiatives/:id/status')
  advance(
    @Param('id') id: string,
    @Body() body: { status: InitiativeStatus; actor: string },
  ) {
    return this.platform.advance(id, body.status, body.actor);
  }

  @Post('initiatives/:id/metrics')
  recordMetric(
    @Param('id') id: string,
    @Body() body: { metric: string; value: number; actor: string },
  ) {
    return this.platform.recordMetric(
      id,
      body.metric,
      body.value,
      body.actor,
    );
  }

  @Post('initiatives/:id/lessons')
  addLesson(
    @Param('id') id: string,
    @Body() body: { lesson: string; actor: string },
  ) {
    return this.platform.addLesson(id, body.lesson, body.actor);
  }

  @Post('initiatives/:id/blockers')
  addBlocker(
    @Param('id') id: string,
    @Body() body: { blocker: string; actor: string },
  ) {
    return this.platform.addBlocker(id, body.blocker, body.actor);
  }
}