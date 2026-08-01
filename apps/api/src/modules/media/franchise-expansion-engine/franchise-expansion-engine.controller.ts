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
  CreateMediaIpAssetInput,
  IpFamilyNode,
  MediaIpPriority,
  MediaIpRight,
  MediaIpStatus,
  MediaIpType,
  UpdateMediaIpAssetInput,
} from '../media-ip-franchise-core/media-ip-franchise-engine.base';

import {
  FranchiseExpansionEngineService,
} from './franchise-expansion-engine.service';

@Controller('media/franchise-expansion')
export class FranchiseExpansionEngineController {
  constructor(
    private readonly service: FranchiseExpansionEngineService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status')
    status?: MediaIpStatus,
    @Query('priority')
    priority?: MediaIpPriority,
    @Query('type')
    type?: MediaIpType,
    @Query('category')
    category?: string,
    @Query('owner')
    owner?: string,
    @Query('language')
    language?: string,
    @Query('market')
    market?: string,
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
      language,
      market,
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

  @Get('records/:id/digital-dna')
  generateDigitalDnaProfile(
    @Param('id') id: string,
  ) {
    return this.service.generateDigitalDnaProfile(
      id,
    );
  }

  @Get('records/:id/protection-plan')
  generateProtectionPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateProtectionPlan(
      id,
    );
  }

  @Get('records/:id/franchise-plan')
  generateFranchisePlan(
    @Param('id') id: string,
  ) {
    return this.service.generateFranchisePlan(
      id,
    );
  }

  @Get('records/:id/licensing-plan')
  generateLicensingPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateLicensingPlan(
      id,
    );
  }

  @Get('records/:id/expansion-plan')
  generateExpansionPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateExpansionPlan(
      id,
    );
  }

  @Get('records/:id/financial-performance')
  calculateIpFinancialPerformance(
    @Param('id') id: string,
  ) {
    return this.service.calculateIpFinancialPerformance(
      id,
    );
  }

  @Get('records/:id/assessment')
  runIpAssessment(@Param('id') id: string) {
    return this.service.runIpAssessment(id);
  }

  @Post('records')
  createRecord(
    @Body() input: CreateMediaIpAssetInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateMediaIpAssetInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/discover')
  discoverAsset(@Param('id') id: string) {
    return this.service.discoverAsset(id);
  }

  @Post('records/:id/evaluate')
  startEvaluation(@Param('id') id: string) {
    return this.service.startEvaluation(id);
  }

  @Post('records/:id/protect')
  markProtected(@Param('id') id: string) {
    return this.service.markProtected(id);
  }

  @Post('records/:id/develop')
  startDevelopment(@Param('id') id: string) {
    return this.service.startDevelopment(id);
  }

  @Post('records/:id/license')
  startLicensing(@Param('id') id: string) {
    return this.service.startLicensing(id);
  }

  @Post('records/:id/expand')
  startExpansion(@Param('id') id: string) {
    return this.service.startExpansion(id);
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

  @Post('records/:id/human-reject')
  rejectByHuman(@Param('id') id: string) {
    return this.service.rejectByHuman(id);
  }

  @Post('records/:id/activate')
  activateAsset(@Param('id') id: string) {
    return this.service.activateAsset(id);
  }

  @Post('records/:id/retire')
  retireAsset(@Param('id') id: string) {
    return this.service.retireAsset(id);
  }

  @Post('records/:id/archive')
  archiveRecord(@Param('id') id: string) {
    return this.service.archiveRecord(id);
  }

  @Post('records/:id/family-tree')
  addFamilyNode(
    @Param('id') id: string,
    @Body() input: Partial<IpFamilyNode>,
  ) {
    return this.service.addFamilyNode(id, input);
  }

  @Patch(
    'records/:id/family-tree/:nodeId',
  )
  updateFamilyNode(
    @Param('id') id: string,
    @Param('nodeId') nodeId: string,
    @Body() input: Partial<IpFamilyNode>,
  ) {
    return this.service.updateFamilyNode(
      id,
      nodeId,
      input,
    );
  }

  @Delete(
    'records/:id/family-tree/:nodeId',
  )
  removeFamilyNode(
    @Param('id') id: string,
    @Param('nodeId') nodeId: string,
  ) {
    return this.service.removeFamilyNode(
      id,
      nodeId,
    );
  }

  @Post('records/:id/rights')
  addRight(
    @Param('id') id: string,
    @Body() input: Partial<MediaIpRight>,
  ) {
    return this.service.addRight(id, input);
  }

  @Patch('records/:id/rights/:rightId')
  updateRight(
    @Param('id') id: string,
    @Param('rightId') rightId: string,
    @Body() input: Partial<MediaIpRight>,
  ) {
    return this.service.updateRight(
      id,
      rightId,
      input,
    );
  }

  @Delete('records/:id/rights/:rightId')
  removeRight(
    @Param('id') id: string,
    @Param('rightId') rightId: string,
  ) {
    return this.service.removeRight(
      id,
      rightId,
    );
  }

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }
}
