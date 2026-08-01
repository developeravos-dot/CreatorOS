import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MediaGrowthOpportunityPlatformService } from './media-growth-opportunity-platform.service';
import { OpportunitySignalInput } from './media-growth-opportunity.types';

@Controller('media/growth-opportunities')
export class MediaGrowthOpportunityPlatformController {
  constructor(
    private readonly platform: MediaGrowthOpportunityPlatformService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return this.platform.capabilities();
  }

  @Get('dashboard')
  dashboard() {
    return this.platform.dashboard();
  }

  @Get()
  list() {
    return this.platform.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.platform.get(id);
  }

  @Post()
  create(@Body() input: OpportunitySignalInput) {
    return this.platform.create(input);
  }

  @Post(':id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.platform.approve(id, body.approvedBy);
  }

  @Post(':id/experiment')
  launchExperiment(
    @Param('id') id: string,
    @Body()
    body: {
      hypothesis: string;
      successMetric: string;
      targetValue: number;
    },
  ) {
    return this.platform.launchExperiment(
      id,
      body.hypothesis,
      body.successMetric,
      body.targetValue,
    );
  }

  @Patch(':id/result')
  recordResult(
    @Param('id') id: string,
    @Body() body: { actualValue: number },
  ) {
    return this.platform.recordResult(id, body.actualValue);
  }

  @Post(':id/scale')
  scale(@Param('id') id: string) {
    return this.platform.scale(id);
  }

  @Post(':id/pause')
  pause(@Param('id') id: string) {
    return this.platform.pause(id);
  }
}