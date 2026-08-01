import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  CreateMediaPublishingInput,
  PublishingPriority,
  PublishingStatus,
  PublishingType,
  UpdateMediaPublishingInput,
} from '../media-publishing-growth-core/media-publishing-growth-engine.base';

import {
  MetadataThumbnailOptimizationService,
} from './metadata-thumbnail-optimization.service';

@Controller('media/metadata-thumbnail-optimization')
export class MetadataThumbnailOptimizationController {
  constructor(
    private readonly service: MetadataThumbnailOptimizationService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status')
    status?: PublishingStatus,
    @Query('priority')
    priority?: PublishingPriority,
    @Query('type')
    type?: PublishingType,
    @Query('category')
    category?: string,
    @Query('owner')
    owner?: string,
    @Query('platform')
    platform?: string,
    @Query('language')
    language?: string,
    @Query('region')
    region?: string,
    @Query('search')
    search?: string,
    @Query('humanApproved')
    humanApproved?: string,
  ) {
    return this.service.listRecords({
      status,
      priority,
      type,
      category,
      owner,
      platform,
      language,
      region,
      search,
      humanApproved:
        humanApproved === undefined
          ? undefined
          : humanApproved === 'true',
    });
  }

  @Get('records/top')
  getTopRecords(
    @Query('limit') limit?: string,
  ) {
    return this.service.getTopRecords(
      Number(limit ?? 10),
    );
  }

  @Get('records/:id')
  getRecord(@Param('id') id: string) {
    return this.service.getRecord(id);
  }

  @Get('records/:id/metadata-blueprint')
  generateMetadataBlueprint(
    @Param('id') id: string,
  ) {
    return this.service.generateMetadataBlueprint(
      id,
    );
  }

  @Get('records/:id/localization-plan')
  generateLocalizationPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateLocalizationPlan(
      id,
    );
  }

  @Get('records/:id/distribution-plan')
  generateDistributionPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateDistributionPlan(
      id,
    );
  }

  @Get('records/:id/growth-plan')
  generateGrowthPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateGrowthPlan(id);
  }

  @Get('records/:id/performance')
  calculatePerformance(
    @Param('id') id: string,
  ) {
    return this.service.calculatePerformance(id);
  }

  @Get('records/:id/release-readiness')
  runReleaseReadinessAssessment(
    @Param('id') id: string,
  ) {
    return this.service.runReleaseReadinessAssessment(
      id,
    );
  }

  @Post('records')
  createRecord(
    @Body() input: CreateMediaPublishingInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateMediaPublishingInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/planning')
  startPlanning(@Param('id') id: string) {
    return this.service.startPlanning(id);
  }

  @Post('records/:id/optimization')
  startOptimization(
    @Param('id') id: string,
  ) {
    return this.service.startOptimization(id);
  }

  @Post('records/:id/localization')
  startLocalization(
    @Param('id') id: string,
  ) {
    return this.service.startLocalization(id);
  }

  @Post('records/:id/schedule')
  scheduleRelease(
    @Param('id') id: string,
    @Body('scheduledAt')
    scheduledAt: string,
  ) {
    return this.service.scheduleRelease(
      id,
      scheduledAt,
    );
  }

  @Post('records/:id/human-approve')
  approveByHuman(@Param('id') id: string) {
    return this.service.approveByHuman(id);
  }

  @Post('records/:id/human-reject')
  rejectByHuman(@Param('id') id: string) {
    return this.service.rejectByHuman(id);
  }

  @Post('records/:id/publish')
  startPublishing(@Param('id') id: string) {
    return this.service.startPublishing(id);
  }

  @Post('records/:id/published')
  markPublished(
    @Param('id') id: string,
    @Body('publishedAt')
    publishedAt?: string,
  ) {
    return this.service.markPublished(
      id,
      publishedAt,
    );
  }

  @Post('records/:id/monitor')
  startMonitoring(@Param('id') id: string) {
    return this.service.startMonitoring(id);
  }

  @Post('records/:id/pause')
  pauseCampaign(@Param('id') id: string) {
    return this.service.pauseCampaign(id);
  }

  @Post('records/:id/complete')
  completeCampaign(@Param('id') id: string) {
    return this.service.completeCampaign(id);
  }

  @Post('records/:id/archive')
  archiveRecord(@Param('id') id: string) {
    return this.service.archiveRecord(id);
  }

  @Post('records/:id/channels')
  addDistributionChannel(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addDistributionChannel(
      id,
      input,
    );
  }

  @Patch('records/:id/channels/:channelId')
  updateDistributionChannel(
    @Param('id') id: string,
    @Param('channelId')
    channelId: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.updateDistributionChannel(
      id,
      channelId,
      input,
    );
  }

  @Delete('records/:id/channels/:channelId')
  removeDistributionChannel(
    @Param('id') id: string,
    @Param('channelId')
    channelId: string,
  ) {
    return this.service.removeDistributionChannel(
      id,
      channelId,
    );
  }

  @Post('records/:id/experiments')
  addExperiment(
    @Param('id') id: string,
    @Body('experiment')
    experiment: string,
  ) {
    return this.service.addExperiment(
      id,
      experiment,
    );
  }

  @Patch('records/:id/performance')
  updatePerformance(
    @Param('id') id: string,
    @Body()
    metrics: Record<string, number>,
  ) {
    return this.service.updatePerformance(
      id,
      metrics,
    );
  }

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }
}
