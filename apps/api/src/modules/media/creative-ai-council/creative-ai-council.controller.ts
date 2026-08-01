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
  CreateMediaCoreInput,
  MediaCorePriority,
  MediaCoreRisk,
  MediaCoreStatus,
  MediaCoreType,
  UpdateMediaCoreInput,
} from '../media-core/media-core-engine.base';

import {
  CreativeAiCouncilService,
} from './creative-ai-council.service';

@Controller('media/creative-ai-council')
export class CreativeAiCouncilController {
  constructor(
    private readonly service: CreativeAiCouncilService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status')
    status?: MediaCoreStatus,
    @Query('priority')
    priority?: MediaCorePriority,
    @Query('risk')
    risk?: MediaCoreRisk,
    @Query('type')
    type?: MediaCoreType,
    @Query('category')
    category?: string,
    @Query('owner')
    owner?: string,
    @Query('platform')
    platform?: string,
    @Query('language')
    language?: string,
    @Query('search')
    search?: string,
    @Query('humanApproved')
    humanApproved?: string,
  ) {
    return this.service.listRecords({
      status,
      priority,
      risk,
      type,
      category,
      owner,
      platform,
      language,
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

  @Get('records/:id/creative-analysis')
  analyzeCreativeDirection(
    @Param('id') id: string,
  ) {
    return this.service.analyzeCreativeDirection(
      id,
    );
  }

  @Get('records/:id/business-case')
  calculateBusinessCase(
    @Param('id') id: string,
  ) {
    return this.service.calculateBusinessCase(
      id,
    );
  }

  @Get('records/:id/agent-council')
  generateAgentCouncil(
    @Param('id') id: string,
  ) {
    return this.service.generateAgentCouncil(
      id,
    );
  }

  @Get('records/:id/production-blueprint')
  generateProductionBlueprint(
    @Param('id') id: string,
  ) {
    return this.service.generateProductionBlueprint(
      id,
    );
  }

  @Post('records')
  createRecord(
    @Body() input: CreateMediaCoreInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateMediaCoreInput,
  ) {
    return this.service.updateRecord(
      id,
      input,
    );
  }

  @Post('records/:id/analyze')
  startAnalysis(@Param('id') id: string) {
    return this.service.startAnalysis(id);
  }

  @Post('records/:id/plan')
  startPlanning(@Param('id') id: string) {
    return this.service.startPlanning(id);
  }

  @Post('records/:id/review')
  submitForReview(@Param('id') id: string) {
    return this.service.submitForReview(id);
  }

  @Post('records/:id/human-approve')
  approveByHuman(@Param('id') id: string) {
    return this.service.approveByHuman(id);
  }

  @Post('records/:id/execute')
  startExecution(@Param('id') id: string) {
    return this.service.startExecution(id);
  }

  @Post('records/:id/activate')
  activateRecord(@Param('id') id: string) {
    return this.service.activateRecord(id);
  }

  @Post('records/:id/pause')
  pauseRecord(@Param('id') id: string) {
    return this.service.pauseRecord(id);
  }

  @Post('records/:id/complete')
  completeRecord(@Param('id') id: string) {
    return this.service.completeRecord(id);
  }

  @Post('records/:id/reject')
  rejectRecord(@Param('id') id: string) {
    return this.service.rejectRecord(id);
  }

  @Post('records/:id/archive')
  archiveRecord(@Param('id') id: string) {
    return this.service.archiveRecord(id);
  }

  @Post('records/:id/agents')
  assignAgent(
    @Param('id') id: string,
    @Body('agent') agent: string,
  ) {
    return this.service.assignAgent(
      id,
      agent,
    );
  }

  @Post('records/:id/capabilities')
  addCapability(
    @Param('id') id: string,
    @Body('capability') capability: string,
  ) {
    return this.service.addCapability(
      id,
      capability,
    );
  }

  @Post('records/:id/recommendations')
  addRecommendation(
    @Param('id') id: string,
    @Body('recommendation')
    recommendation: string,
  ) {
    return this.service.addRecommendation(
      id,
      recommendation,
    );
  }

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }
}
