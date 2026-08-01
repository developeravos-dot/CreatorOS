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
  CreateMonetizationRecordInput,
  MonetizationCurrency,
  MonetizationPriority,
  MonetizationStatus,
  UpdateMonetizationRecordInput,
} from '../monetization-core/monetization-engine.base';

import {
  SponsorshipManagerService,
} from './sponsorship-manager.service';

@Controller('youtube/sponsorship-manager')
export class SponsorshipManagerController {
  constructor(
    private readonly service: SponsorshipManagerService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status') status?: MonetizationStatus,
    @Query('priority') priority?: MonetizationPriority,
    @Query('category') category?: string,
    @Query('currency') currency?: MonetizationCurrency,
    @Query('search') search?: string,
    @Query('minimumRevenue') minimumRevenue?: string,
    @Query('minimumScore') minimumScore?: string,
  ) {
    return this.service.listRecords({
      status,
      priority,
      category,
      currency,
      search,
      minimumRevenue:
        minimumRevenue !== undefined
          ? Number(minimumRevenue)
          : undefined,
      minimumScore:
        minimumScore !== undefined
          ? Number(minimumScore)
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

  @Get('records/:id/summary')
  getFinancialSummary(
    @Param('id') id: string,
  ) {
    return this.service.getFinancialSummary(id);
  }

  @Get('records/:id/recommendations')
  generateRecommendations(
    @Param('id') id: string,
  ) {
    return this.service.generateRecommendations(id);
  }

  @Post('records')
  createRecord(
    @Body() input: CreateMonetizationRecordInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateMonetizationRecordInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/plan')
  planRecord(@Param('id') id: string) {
    return this.service.planRecord(id);
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

  @Post('records/:id/cancel')
  cancelRecord(@Param('id') id: string) {
    return this.service.cancelRecord(id);
  }

  @Post('records/:id/revenue')
  addRevenue(
    @Param('id') id: string,
    @Body('amount') amount: number,
  ) {
    return this.service.addRevenue(id, amount);
  }

  @Post('records/:id/cost')
  addCost(
    @Param('id') id: string,
    @Body('amount') amount: number,
  ) {
    return this.service.addCost(id, amount);
  }

  @Post('forecast')
  forecastRevenue(
    @Body('currentRevenue') currentRevenue: number,
    @Body('growthRate') growthRate: number,
    @Body('periods') periods: number,
  ) {
    return this.service.forecastRevenue(
      currentRevenue,
      growthRate,
      periods,
    );
  }

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }
}
