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
  CreateMediaMonetizationInput,
  MonetizationPriority,
  MonetizationStatus,
  MonetizationType,
  UpdateMediaMonetizationInput,
} from '../media-monetization-core/media-monetization-engine.base';

import {
  ContentLicensingRevenueEngineService,
} from './content-licensing-revenue-engine.service';

@Controller('media/content-licensing-revenue')
export class ContentLicensingRevenueEngineController {
  constructor(
    private readonly service: ContentLicensingRevenueEngineService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status')
    status?: MonetizationStatus,
    @Query('priority')
    priority?: MonetizationPriority,
    @Query('type')
    type?: MonetizationType,
    @Query('category')
    category?: string,
    @Query('owner')
    owner?: string,
    @Query('platform')
    platform?: string,
    @Query('region')
    region?: string,
    @Query('currency')
    currency?: string,
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
      region,
      currency,
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

  @Get('records/:id/advertising-plan')
  generateAdvertisingPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateAdvertisingPlan(
      id,
    );
  }

  @Get('records/:id/sponsorship-plan')
  generateSponsorshipPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateSponsorshipPlan(
      id,
    );
  }

  @Get('records/:id/affiliate-plan')
  generateAffiliatePlan(
    @Param('id') id: string,
  ) {
    return this.service.generateAffiliatePlan(
      id,
    );
  }

  @Get('records/:id/digital-product-plan')
  generateDigitalProductPlan(
    @Param('id') id: string,
  ) {
    return this.service.generateDigitalProductPlan(
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

  @Get('records/:id/performance')
  calculateCommercialPerformance(
    @Param('id') id: string,
  ) {
    return this.service.calculateCommercialPerformance(
      id,
    );
  }

  @Get('records/:id/assessment')
  runMonetizationAssessment(
    @Param('id') id: string,
  ) {
    return this.service.runMonetizationAssessment(
      id,
    );
  }

  @Post('records')
  createRecord(
    @Body() input: CreateMediaMonetizationInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateMediaMonetizationInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/discovery')
  startDiscovery(@Param('id') id: string) {
    return this.service.startDiscovery(id);
  }

  @Post('records/:id/evaluation')
  startEvaluation(@Param('id') id: string) {
    return this.service.startEvaluation(id);
  }

  @Post('records/:id/negotiation')
  startNegotiation(
    @Param('id') id: string,
  ) {
    return this.service.startNegotiation(id);
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
  activateMonetization(
    @Param('id') id: string,
  ) {
    return this.service.activateMonetization(id);
  }

  @Post('records/:id/pause')
  pauseMonetization(
    @Param('id') id: string,
  ) {
    return this.service.pauseMonetization(id);
  }

  @Post('records/:id/complete')
  completeMonetization(
    @Param('id') id: string,
  ) {
    return this.service.completeMonetization(id);
  }

  @Post('records/:id/archive')
  archiveRecord(@Param('id') id: string) {
    return this.service.archiveRecord(id);
  }

  @Post('records/:id/transactions')
  addTransaction(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addTransaction(id, input);
  }

  @Delete(
    'records/:id/transactions/:transactionId',
  )
  removeTransaction(
    @Param('id') id: string,
    @Param('transactionId')
    transactionId: string,
  ) {
    return this.service.removeTransaction(
      id,
      transactionId,
    );
  }

  @Post('records/:id/partners')
  addPartner(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.addPartner(id, input);
  }

  @Patch('records/:id/partners/:partnerId')
  updatePartner(
    @Param('id') id: string,
    @Param('partnerId') partnerId: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.updatePartner(
      id,
      partnerId,
      input,
    );
  }

  @Delete('records/:id/partners/:partnerId')
  removePartner(
    @Param('id') id: string,
    @Param('partnerId') partnerId: string,
  ) {
    return this.service.removePartner(
      id,
      partnerId,
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
