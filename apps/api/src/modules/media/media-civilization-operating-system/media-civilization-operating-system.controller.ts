import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MediaCivilizationOperatingSystemService } from './media-civilization-operating-system.service';
import {
  CivilizationProgramInput,
  CivilizationProgramStatus,
} from './media-civilization.types';

@Controller('media/civilization-os')
export class MediaCivilizationOperatingSystemController {
  constructor(
    private readonly civilization: MediaCivilizationOperatingSystemService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return this.civilization.capabilities();
  }

  @Get('dashboard')
  dashboard() {
    return this.civilization.dashboard();
  }

  @Get('programs')
  list() {
    return this.civilization.list();
  }

  @Get('programs/:id')
  get(@Param('id') id: string) {
    return this.civilization.get(id);
  }

  @Post('programs')
  create(@Body() input: CivilizationProgramInput) {
    return this.civilization.create(input);
  }

  @Post('programs/:id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.civilization.approve(id, body.approvedBy);
  }

  @Patch('programs/:id/status')
  advance(
    @Param('id') id: string,
    @Body() body: {
      status: CivilizationProgramStatus;
      actor: string;
    },
  ) {
    return this.civilization.advance(
      id,
      body.status,
      body.actor,
    );
  }

  @Post('programs/:id/workstreams/activate')
  activateWorkstreams(
    @Param('id') id: string,
    @Body() body: { actor: string },
  ) {
    return this.civilization.activateWorkstreams(id, body.actor);
  }

  @Post('programs/:id/metrics')
  updateMetric(
    @Param('id') id: string,
    @Body() body: {
      metric: string;
      value: number;
      actor: string;
    },
  ) {
    return this.civilization.updateMetric(
      id,
      body.metric,
      body.value,
      body.actor,
    );
  }

  @Post('programs/:id/blockers')
  addBlocker(
    @Param('id') id: string,
    @Body() body: { blocker: string; actor: string },
  ) {
    return this.civilization.addBlocker(
      id,
      body.blocker,
      body.actor,
    );
  }

  @Post('programs/:id/agreements')
  addAgreement(
    @Param('id') id: string,
    @Body() body: { agreement: string; actor: string },
  ) {
    return this.civilization.addAgreement(
      id,
      body.agreement,
      body.actor,
    );
  }
}