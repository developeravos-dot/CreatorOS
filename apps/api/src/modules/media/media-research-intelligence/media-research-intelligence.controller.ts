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
  CreateMediaDevelopmentInput,
  DevelopmentPriority,
  DevelopmentStatus,
  DevelopmentType,
  UpdateMediaDevelopmentInput,
} from '../media-development-core/media-development-engine.base';

import {
  MediaResearchIntelligenceService,
} from './media-research-intelligence.service';

@Controller('media/research-intelligence')
export class MediaResearchIntelligenceController {
  constructor(
    private readonly service: MediaResearchIntelligenceService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status')
    status?: DevelopmentStatus,
    @Query('priority')
    priority?: DevelopmentPriority,
    @Query('type')
    type?: DevelopmentType,
    @Query('category')
    category?: string,
    @Query('owner')
    owner?: string,
    @Query('platform')
    platform?: string,
    @Query('language')
    language?: string,
    @Query('culture')
    culture?: string,
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
      culture,
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

  @Get('records/:id/evaluation')
  evaluateIdea(@Param('id') id: string) {
    return this.service.evaluateIdea(id);
  }

  @Get('records/:id/research-brief')
  generateResearchBrief(
    @Param('id') id: string,
  ) {
    return this.service.generateResearchBrief(
      id,
    );
  }

  @Get('records/:id/concept-blueprint')
  generateConceptBlueprint(
    @Param('id') id: string,
  ) {
    return this.service.generateConceptBlueprint(
      id,
    );
  }

  @Get('records/:id/story-architecture')
  generateStoryArchitecture(
    @Param('id') id: string,
  ) {
    return this.service.generateStoryArchitecture(
      id,
    );
  }

  @Get('records/:id/audience-profile')
  generateAudienceProfile(
    @Param('id') id: string,
  ) {
    return this.service.generateAudienceProfile(
      id,
    );
  }

  @Get('records/:id/format-system')
  generateFormatSystem(
    @Param('id') id: string,
  ) {
    return this.service.generateFormatSystem(id);
  }

  @Post('records')
  createRecord(
    @Body() input: CreateMediaDevelopmentInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateMediaDevelopmentInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/research')
  startResearch(@Param('id') id: string) {
    return this.service.startResearch(id);
  }

  @Post('records/:id/ideate')
  startIdeation(@Param('id') id: string) {
    return this.service.startIdeation(id);
  }

  @Post('records/:id/evaluate')
  startEvaluation(@Param('id') id: string) {
    return this.service.startEvaluation(id);
  }

  @Post('records/:id/develop')
  startDevelopment(@Param('id') id: string) {
    return this.service.startDevelopment(id);
  }

  @Post('records/:id/review')
  submitForReview(@Param('id') id: string) {
    return this.service.submitForReview(id);
  }

  @Post('records/:id/human-approve')
  approveByHuman(@Param('id') id: string) {
    return this.service.approveByHuman(id);
  }

  @Post('records/:id/human-reject')
  rejectByHuman(@Param('id') id: string) {
    return this.service.rejectByHuman(id);
  }

  @Post('records/:id/archive')
  archiveRecord(@Param('id') id: string) {
    return this.service.archiveRecord(id);
  }

  @Post('records/:id/sources')
  addSource(
    @Param('id') id: string,
    @Body('source') source: string,
  ) {
    return this.service.addSource(id, source);
  }

  @Post('records/:id/trends')
  addTrend(
    @Param('id') id: string,
    @Body('trend') trend: string,
  ) {
    return this.service.addTrend(id, trend);
  }

  @Post('records/:id/opportunities')
  addOpportunity(
    @Param('id') id: string,
    @Body('opportunity') opportunity: string,
  ) {
    return this.service.addOpportunity(
      id,
      opportunity,
    );
  }

  @Post('records/:id/story-elements')
  addStoryElement(
    @Param('id') id: string,
    @Body('storyElement')
    storyElement: string,
  ) {
    return this.service.addStoryElement(
      id,
      storyElement,
    );
  }

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }
}
