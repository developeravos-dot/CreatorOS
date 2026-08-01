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
  CreateIpAssetInput,
  IpAsset,
  IpAssetType,
  IpEmpireStage,
  IpEmpireStatus,
} from '../media-ip-empire-core/media-ip-empire-engine.base';

import {
  IpCommercializationDistributionStageService,
} from './ip-commercialization-distribution-stage.service';

@Controller('media/ip-empire/ip-commercialization-distribution')
export class IpCommercializationDistributionStageController {
  constructor(
    private readonly service: IpCommercializationDistributionStageService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('blueprint')
  getBlueprint() {
    return this.service.getBlueprint();
  }

  @Get('assets')
  listAssets(
    @Query('status')
    status?: IpEmpireStatus,

    @Query('type')
    type?: IpAssetType,

    @Query('stage')
    stage?: IpEmpireStage,

    @Query('owner')
    owner?: string,

    @Query('search')
    search?: string,
  ) {
    return this.service.listAssets({
      status,
      type,
      stage,
      owner,
      search,
    });
  }

  @Post('assets')
  createAsset(
    @Body() input: CreateIpAssetInput,
  ) {
    return this.service.createAsset(input);
  }

  @Get('assets/:id')
  getAsset(@Param('id') id: string) {
    return this.service.getAsset(id);
  }

  @Patch('assets/:id')
  updateAsset(
    @Param('id') id: string,
    @Body() input: Partial<IpAsset>,
  ) {
    return this.service.updateAsset(id, input);
  }

  @Delete('assets/:id')
  removeAsset(@Param('id') id: string) {
    return this.service.removeAsset(id);
  }

  @Post('assets/:id/human-approve-autonomy')
  approveAutonomy(
    @Param('id') id: string,
    @Body('approvedBy') approvedBy: string,
  ) {
    return this.service.approveAutonomousExecution(
      id,
      approvedBy,
    );
  }

  @Post('assets/:id/start')
  startLifecycle(@Param('id') id: string) {
    return this.service.startLifecycle(id);
  }

  @Post('assets/:id/execute-stage')
  executeManagedStage(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.executeManagedStage(
      id,
      input as never,
    );
  }

  @Post('assets/:id/complete-stage')
  completeManagedStage(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.completeManagedStage(
      id,
      input as never,
    );
  }

  @Post('assets/:id/stages/:stage/human-review')
  submitHumanReview(
    @Param('id') id: string,
    @Param('stage') stage: IpEmpireStage,
  ) {
    return this.service.submitStageForHumanReview(
      id,
      stage,
    );
  }

  @Post('assets/:id/stages/:stage/human-approve')
  approveStage(
    @Param('id') id: string,
    @Param('stage') stage: IpEmpireStage,
    @Body('approvedBy') approvedBy: string,
  ) {
    return this.service.approveStage(
      id,
      stage,
      approvedBy,
    );
  }

  @Post('assets/:id/stages/:stage/human-reject')
  rejectStage(
    @Param('id') id: string,
    @Param('stage') stage: IpEmpireStage,
    @Body('reason') reason: string,
    @Body('decidedBy') decidedBy: string,
  ) {
    return this.service.rejectStage(
      id,
      stage,
      reason,
      decidedBy,
    );
  }

  @Post('assets/:id/digital-dna')
  generateDigitalDna(
    @Param('id') id: string,
  ) {
    return this.service.generateDigitalDna(id);
  }

  @Post('assets/:id/evidence')
  addEvidence(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addEvidence(
      id,
      input as never,
    );
  }

  @Post('assets/:id/evidence/:evidenceId/verify')
  verifyEvidence(
    @Param('id') id: string,
    @Param('evidenceId') evidenceId: string,
    @Body('verifiedBy') verifiedBy: string,
  ) {
    return this.service.verifyEvidence(
      id,
      evidenceId,
      verifiedBy,
    );
  }

  @Post('assets/:id/rights')
  addRightsRecord(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addRightsRecord(
      id,
      input as never,
    );
  }

  @Post('assets/:id/rights/:rightsId/human-approve')
  approveRightsRecord(
    @Param('id') id: string,
    @Param('rightsId') rightsId: string,
  ) {
    return this.service.approveRightsRecord(
      id,
      rightsId,
    );
  }

  @Post('assets/:id/protections')
  addProtection(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addProtection(
      id,
      input as never,
    );
  }

  @Post('assets/:id/protections/:protectionId/human-approve')
  approveProtection(
    @Param('id') id: string,
    @Param('protectionId')
    protectionId: string,
  ) {
    return this.service.approveProtection(
      id,
      protectionId,
    );
  }

  @Post('assets/:id/valuation')
  calculateValuation(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.calculateValuation(
      id,
      input as never,
    );
  }

  @Post('assets/:id/licenses')
  addLicense(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addLicense(
      id,
      input as never,
    );
  }

  @Post('assets/:id/licenses/:licenseId/human-approve')
  approveLicense(
    @Param('id') id: string,
    @Param('licenseId') licenseId: string,
  ) {
    return this.service.approveLicense(
      id,
      licenseId,
    );
  }

  @Post('assets/:id/products')
  addProduct(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addProduct(
      id,
      input as never,
    );
  }

  @Post('assets/:id/products/:productId/human-approve')
  approveProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.service.approveProduct(
      id,
      productId,
    );
  }

  @Post('assets/:id/infringements')
  addInfringementCase(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addInfringementCase(
      id,
      input as never,
    );
  }

  @Post('assets/:id/infringements/:caseId/human-approve')
  approveEnforcement(
    @Param('id') id: string,
    @Param('caseId') caseId: string,
  ) {
    return this.service.approveEnforcement(
      id,
      caseId,
    );
  }

  @Post('assets/:parentId/children/:childId')
  linkChildAsset(
    @Param('parentId') parentId: string,
    @Param('childId') childId: string,
  ) {
    return this.service.linkChildAsset(
      parentId,
      childId,
    );
  }

  @Post('assets/:id/reinvestment')
  calculateReinvestment(
    @Param('id') id: string,
    @Body('percentage') percentage: number,
  ) {
    return this.service.calculateReinvestment(
      id,
      percentage,
    );
  }

  @Get('portfolio/ranking')
  getPortfolioRanking() {
    return this.service.getPortfolioRanking();
  }

  @Get('assets/:id/commercialization-plan')
  generateCommercializationPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateCommercializationPlan(
      id,
    );
  }

  @Get('assets/:id/protection-plan')
  generateProtectionPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateProtectionPlan(
      id,
    );
  }

  @Get('assets/:id/report')
  generateIpReport(
    @Param('id') id: string,
  ) {
    return this.service.generateIpReport(id);
  }
}
