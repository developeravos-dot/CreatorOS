import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MediaGlobalOperatingSystemService } from './media-global-operating-system.service';
import {
  GlobalMediaProgramInput,
  ProgramStatus,
} from './media-global-operating-system.types';

@Controller('media/global-operating-system')
export class MediaGlobalOperatingSystemController {
  constructor(
    private readonly system: MediaGlobalOperatingSystemService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return this.system.capabilities();
  }

  @Get('dashboard')
  dashboard() {
    return this.system.dashboard();
  }

  @Get('programs')
  list() {
    return this.system.list();
  }

  @Get('programs/:id')
  get(@Param('id') id: string) {
    return this.system.get(id);
  }

  @Post('programs')
  create(@Body() input: GlobalMediaProgramInput) {
    return this.system.create(input);
  }

  @Post('programs/:id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.system.approve(id, body.approvedBy);
  }

  @Patch('programs/:id/status')
  advance(
    @Param('id') id: string,
    @Body() body: { status: ProgramStatus; actor: string },
  ) {
    return this.system.advance(id, body.status, body.actor);
  }

  @Post('programs/:id/metrics')
  recordMetric(
    @Param('id') id: string,
    @Body()
    body: {
      metric: string;
      value: number;
      actor: string;
    },
  ) {
    return this.system.recordMetric(
      id,
      body.metric,
      body.value,
      body.actor,
    );
  }

  @Post('programs/:id/revenue')
  recordRevenue(
    @Param('id') id: string,
    @Body() body: { amount: number; actor: string },
  ) {
    return this.system.recordRevenue(id, body.amount, body.actor);
  }

  @Post('programs/:id/incidents')
  reportIncident(
    @Param('id') id: string,
    @Body() body: { incident: string; actor: string },
  ) {
    return this.system.reportIncident(id, body.incident, body.actor);
  }
}