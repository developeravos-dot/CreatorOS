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
  ComplianceStatus,
  CreateGlobalExpansionInput,
  ExpansionPriority,
  ExpansionStatus,
  ExpansionType,
  UpdateGlobalExpansionInput,
} from '../global-expansion-core/global-expansion-engine.base';

import {
  GlobalDistributionCenterService,
} from './global-distribution-center.service';

@Controller('youtube/global-distribution-center')
export class GlobalDistributionCenterController {
  constructor(
    private readonly service: GlobalDistributionCenterService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status') status?: ExpansionStatus,
    @Query('priority') priority?: ExpansionPriority,
    @Query('type') type?: ExpansionType,
    @Query('complianceStatus')
    complianceStatus?: ComplianceStatus,
    @Query('category') category?: string,
    @Query('owner') owner?: string,
    @Query('country') country?: string,
    @Query('region') region?: string,
    @Query('targetLanguage')
    targetLanguage?: string,
    @Query('search') search?: string,
    @Query('minimumOpportunityScore')
    minimumOpportunityScore?: string,
  ) {
    return this.service.listRecords({
      status,
      priority,
      type,
      complianceStatus,
      category,
      owner,
      country,
      region,
      targetLanguage,
      search,
      minimumOpportunityScore:
        minimumOpportunityScore !== undefined
          ? Number(minimumOpportunityScore)
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

  @Get('records/:id/market-opportunity')
  analyzeMarketOpportunity(
    @Param('id') id: string,
  ) {
    return this.service.analyzeMarketOpportunity(
      id,
    );
  }

  @Get('records/:id/expansion-case')
  calculateExpansionCase(
    @Param('id') id: string,
  ) {
    return this.service.calculateExpansionCase(id);
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

  @Get('records/:id/compliance-assessment')
  runComplianceAssessment(
    @Param('id') id: string,
  ) {
    return this.service.runComplianceAssessment(
      id,
    );
  }

  @Post('records')
  createRecord(
    @Body() input: CreateGlobalExpansionInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateGlobalExpansionInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/research')
  startResearch(@Param('id') id: string) {
    return this.service.startResearch(id);
  }

  @Post('records/:id/localize')
  startLocalization(@Param('id') id: string) {
    return this.service.startLocalization(id);
  }

  @Post('records/:id/review')
  submitForReview(@Param('id') id: string) {
    return this.service.submitForReview(id);
  }

  @Post('records/:id/approve')
  approveRecord(@Param('id') id: string) {
    return this.service.approveRecord(id);
  }

  @Post('records/:id/launch')
  launchRecord(@Param('id') id: string) {
    return this.service.launchRecord(id);
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

  @Post('records/:id/compliance')
  updateCompliance(
    @Param('id') id: string,
    @Body()
    input: {
      complianceStatus: ComplianceStatus;
      complianceScore: number;
    },
  ) {
    return this.service.updateCompliance(
      id,
      input.complianceStatus,
      input.complianceScore,
    );
  }

  @Post('records/:id/distribution-channels')
  addDistributionChannel(
    @Param('id') id: string,
    @Body('channel') channel: string,
  ) {
    return this.service.addDistributionChannel(
      id,
      channel,
    );
  }

  @Post('records/:id/risks')
  addRisk(
    @Param('id') id: string,
    @Body('risk') risk: string,
  ) {
    return this.service.addRisk(id, risk);
  }

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }
}
