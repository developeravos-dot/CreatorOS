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
  AudiencePriority,
  AudienceSegment,
  AudienceStatus,
  CreateAudienceRecordInput,
  SentimentType,
  UpdateAudienceRecordInput,
} from '../audience-community-core/audience-community-engine.base';

import {
  CommentIntelligenceService,
} from './comment-intelligence.service';

@Controller('youtube/comment-intelligence')
export class CommentIntelligenceController {
  constructor(
    private readonly service: CommentIntelligenceService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status') status?: AudienceStatus,
    @Query('priority') priority?: AudiencePriority,
    @Query('sentiment') sentiment?: SentimentType,
    @Query('segment') segment?: AudienceSegment,
    @Query('category') category?: string,
    @Query('language') language?: string,
    @Query('country') country?: string,
    @Query('search') search?: string,
    @Query('minimumEngagementScore')
    minimumEngagementScore?: string,
  ) {
    return this.service.listRecords({
      status,
      priority,
      sentiment,
      segment,
      category,
      language,
      country,
      search,
      minimumEngagementScore:
        minimumEngagementScore !== undefined
          ? Number(minimumEngagementScore)
          : undefined,
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

  @Get('records/:id/engagement')
  getEngagementSummary(
    @Param('id') id: string,
  ) {
    return this.service.getEngagementSummary(id);
  }

  @Get('records/:id/recommendations')
  generateRecommendations(
    @Param('id') id: string,
  ) {
    return this.service.generateRecommendations(id);
  }

  @Post('records')
  createRecord(
    @Body() input: CreateAudienceRecordInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateAudienceRecordInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/observe')
  observeRecord(@Param('id') id: string) {
    return this.service.observeRecord(id);
  }

  @Post('records/:id/engage')
  markEngaged(@Param('id') id: string) {
    return this.service.markEngaged(id);
  }

  @Post('records/:id/loyal')
  markLoyal(@Param('id') id: string) {
    return this.service.markLoyal(id);
  }

  @Post('records/:id/inactive')
  markInactive(@Param('id') id: string) {
    return this.service.markInactive(id);
  }

  @Post('records/:id/block')
  blockRecord(@Param('id') id: string) {
    return this.service.blockRecord(id);
  }

  @Post('records/:id/sentiment')
  updateSentiment(
    @Param('id') id: string,
    @Body('sentiment') sentiment: SentimentType,
  ) {
    return this.service.updateSentiment(
      id,
      sentiment,
    );
  }

  @Post('records/:id/interactions')
  addInteraction(
    @Param('id') id: string,
    @Body()
    input: {
      views?: number;
      likes?: number;
      comments?: number;
      shares?: number;
      subscribers?: number;
    },
  ) {
    return this.service.addInteraction(
      id,
      input,
    );
  }

  @Post('analyze-comment')
  analyzeComment(
    @Body('comment') comment: string,
  ) {
    return this.service.analyzeComment(comment);
  }

  @Post('subscriber-forecast')
  forecastSubscriberGrowth(
    @Body('currentSubscribers')
    currentSubscribers: number,
    @Body('monthlyGrowthRate')
    monthlyGrowthRate: number,
    @Body('months') months: number,
  ) {
    return this.service.forecastSubscriberGrowth(
      currentSubscribers,
      monthlyGrowthRate,
      months,
    );
  }

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }
}
