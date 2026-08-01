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
  CreateMediaIntelligenceInput,
  IntelligencePriority,
  IntelligenceStatus,
  IntelligenceType,
  UpdateMediaIntelligenceInput,
} from '../media-intelligence-core/media-intelligence-engine.base';

import {
  TrendOpportunityRadarEngineService,
} from './trend-opportunity-radar-engine.service';

@Controller('media/trend-opportunity-radar')
export class TrendOpportunityRadarEngineController {
  constructor(
    private readonly service: TrendOpportunityRadarEngineService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status')
    status?: IntelligenceStatus,
    @Query('priority')
    priority?: IntelligencePriority,
    @Query('type')
    type?: IntelligenceType,
    @Query('owner')
    owner?: string,
    @Query('platform')
    platform?: string,
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
      owner,
      platform,
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

  @Get('records/:id/performance')
  calculateUnifiedPerformance(
    @Param('id') id: string,
  ) {
    return this.service.calculateUnifiedPerformance(
      id,
    );
  }

  @Get('records/:id/audience-intelligence')
  generateAudienceIntelligence(
    @Param('id') id: string,
  ) {
    return this.service.generateAudienceIntelligence(
      id,
    );
  }

  @Get('records/:id/trend-intelligence')
  generateTrendIntelligence(
    @Param('id') id: string,
  ) {
    return this.service.generateTrendIntelligence(
      id,
    );
  }

  @Get('records/:id/opportunity-radar')
  generateOpportunityRadar(
    @Param('id') id: string,
  ) {
    return this.service.generateOpportunityRadar(
      id,
    );
  }

  @Get('records/:id/forecast-report')
  generateForecastReport(
    @Param('id') id: string,
  ) {
    return this.service.generateForecastReport(
      id,
    );
  }

  @Get('records/:id/executive-brief')
  generateExecutiveDecisionBrief(
    @Param('id') id: string,
  ) {
    return this.service.generateExecutiveDecisionBrief(
      id,
    );
  }

  @Get('records/:id/assessment')
  runIntelligenceAssessment(
    @Param('id') id: string,
  ) {
    return this.service.runIntelligenceAssessment(
      id,
    );
  }

  @Post('records')
  createRecord(
    @Body() input: CreateMediaIntelligenceInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateMediaIntelligenceInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/collect')
  startCollection(@Param('id') id: string) {
    return this.service.startCollection(id);
  }

  @Post('records/:id/analyze')
  startAnalysis(@Param('id') id: string) {
    return this.service.startAnalysis(id);
  }

  @Post('records/:id/forecast')
  startForecasting(@Param('id') id: string) {
    return this.service.startForecasting(id);
  }

  @Post('records/:id/human-review')
  submitForHumanReview(
    @Param('id') id: string,
  ) {
    return this.service.submitForHumanReview(id);
  }

  @Post('records/:id/human-approve')
  approveByHuman(@Param('id') id: string) {
    return this.service.approveByHuman(id);
  }

  @Post('records/:id/activate')
  activateIntelligence(
    @Param('id') id: string,
  ) {
    return this.service.activateIntelligence(id);
  }

  @Post('records/:id/monitor')
  startMonitoring(@Param('id') id: string) {
    return this.service.startMonitoring(id);
  }

  @Post('records/:id/complete')
  completeRecord(@Param('id') id: string) {
    return this.service.completeRecord(id);
  }

  @Post('records/:id/archive')
  archiveRecord(@Param('id') id: string) {
    return this.service.archiveRecord(id);
  }

  @Post('records/:id/metrics')
  addMetric(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addMetric(id, input);
  }

  @Post('records/:id/signals')
  addSignal(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addSignal(id, input);
  }

  @Post('records/:id/forecasts')
  addForecast(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addForecast(id, input);
  }

  @Post('records/:id/decisions')
  addDecision(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addDecision(id, input);
  }

  @Post(
    'records/:id/decisions/:decisionId/approve',
  )
  approveDecision(
    @Param('id') id: string,
    @Param('decisionId')
    decisionId: string,
    @Body('decidedBy')
    decidedBy: string,
  ) {
    return this.service.approveDecision(
      id,
      decisionId,
      decidedBy,
    );
  }

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }
}
