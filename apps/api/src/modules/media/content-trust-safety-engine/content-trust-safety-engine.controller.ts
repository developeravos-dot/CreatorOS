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
  CreateMediaGovernanceInput,
  GovernancePriority,
  GovernanceStatus,
  GovernanceType,
  UpdateMediaGovernanceInput,
} from '../media-governance-core/media-governance-engine.base';

import {
  ContentTrustSafetyEngineService,
} from './content-trust-safety-engine.service';

@Controller('media/content-trust-safety')
export class ContentTrustSafetyEngineController {
  constructor(
    private readonly service: ContentTrustSafetyEngineService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status')
    status?: GovernanceStatus,
    @Query('priority')
    priority?: GovernancePriority,
    @Query('type')
    type?: GovernanceType,
    @Query('owner')
    owner?: string,
    @Query('platform')
    platform?: string,
    @Query('region')
    region?: string,
    @Query('search')
    search?: string,
    @Query('publishingBlocked')
    publishingBlocked?: string,
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
      publishingBlocked:
        publishingBlocked === undefined
          ? undefined
          : publishingBlocked === 'true',
      humanApproved:
        humanApproved === undefined
          ? undefined
          : humanApproved === 'true',
    });
  }

  @Get('records/top-risk')
  getTopRiskRecords(
    @Query('limit') limit?: string,
  ) {
    return this.service.getTopRiskRecords(
      Number(limit ?? 10),
    );
  }

  @Get('records/:id')
  getRecord(@Param('id') id: string) {
    return this.service.getRecord(id);
  }

  @Get('records/:id/safety-plan')
  generateSafetyPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateSafetyPlan(id);
  }

  @Get('records/:id/compliance-plan')
  generateCompliancePlan(
    @Param('id') id: string,
  ) {
    return this.service.generateCompliancePlan(
      id,
    );
  }

  @Get('records/:id/risk-plan')
  generateRiskPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateRiskPlan(id);
  }

  @Get('records/:id/audit-report')
  generateAuditReport(
    @Param('id') id: string,
  ) {
    return this.service.generateAuditReport(id);
  }

  @Get('records/:id/assessment')
  runGovernanceAssessment(
    @Param('id') id: string,
  ) {
    return this.service.runGovernanceAssessment(
      id,
    );
  }

  @Post('records')
  createRecord(
    @Body() input: CreateMediaGovernanceInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateMediaGovernanceInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/assessment')
  startAssessment(@Param('id') id: string) {
    return this.service.startAssessment(id);
  }

  @Post('records/:id/review')
  startReview(@Param('id') id: string) {
    return this.service.startReview(id);
  }

  @Post('records/:id/remediation')
  startRemediation(@Param('id') id: string) {
    return this.service.startRemediation(id);
  }

  @Post('records/:id/human-review')
  submitForHumanReview(
    @Param('id') id: string,
  ) {
    return this.service.submitForHumanReview(id);
  }

  @Post('records/:id/human-approve')
  approveByHuman(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.service.approveByHuman(
      id,
      reason,
    );
  }

  @Post('records/:id/human-reject')
  rejectByHuman(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.service.rejectByHuman(
      id,
      reason,
    );
  }

  @Post('records/:id/block')
  blockPublishing(@Param('id') id: string) {
    return this.service.blockPublishing(id);
  }

  @Post('records/:id/release-block')
  releasePublishingBlock(
    @Param('id') id: string,
  ) {
    return this.service.releasePublishingBlock(
      id,
    );
  }

  @Post('records/:id/monitor')
  startMonitoring(@Param('id') id: string) {
    return this.service.startMonitoring(id);
  }

  @Post('records/:id/resolve')
  resolveRecord(@Param('id') id: string) {
    return this.service.resolveRecord(id);
  }

  @Post('records/:id/archive')
  archiveRecord(@Param('id') id: string) {
    return this.service.archiveRecord(id);
  }

  @Post('records/:id/findings')
  addFinding(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addFinding(id, input);
  }

  @Post(
    'records/:id/findings/:findingId/resolve',
  )
  resolveFinding(
    @Param('id') id: string,
    @Param('findingId') findingId: string,
  ) {
    return this.service.resolveFinding(
      id,
      findingId,
    );
  }

  @Post('records/:id/audit-events')
  addAuditEvent(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addAuditEvent(id, input);
  }

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }
}
