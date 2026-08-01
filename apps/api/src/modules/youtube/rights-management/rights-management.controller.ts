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
  BrandIpPriority,
  BrandIpStatus,
  CreateBrandIpRecordInput,
  IntellectualPropertyType,
  RightsScope,
  UpdateBrandIpRecordInput,
} from '../brand-ip-core/brand-ip-engine.base';

import {
  RightsManagementService,
} from './rights-management.service';

@Controller('youtube/rights-management')
export class RightsManagementController {
  constructor(
    private readonly service: RightsManagementService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('records')
  listRecords(
    @Query('status') status?: BrandIpStatus,
    @Query('priority') priority?: BrandIpPriority,
    @Query('ipType') ipType?: IntellectualPropertyType,
    @Query('rightsScope') rightsScope?: RightsScope,
    @Query('category') category?: string,
    @Query('owner') owner?: string,
    @Query('territory') territory?: string,
    @Query('search') search?: string,
    @Query('minimumCommercialScore')
    minimumCommercialScore?: string,
  ) {
    return this.service.listRecords({
      status,
      priority,
      ipType,
      rightsScope,
      category,
      owner,
      territory,
      search,
      minimumCommercialScore:
        minimumCommercialScore !== undefined
          ? Number(minimumCommercialScore)
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

  @Get('records/:id/protection')
  evaluateProtection(
    @Param('id') id: string,
  ) {
    return this.service.evaluateProtection(id);
  }

  @Get('records/:id/recommendations')
  generateRecommendations(
    @Param('id') id: string,
  ) {
    return this.service.generateRecommendations(id);
  }

  @Post('records')
  createRecord(
    @Body() input: CreateBrandIpRecordInput,
  ) {
    return this.service.createRecord(input);
  }

  @Patch('records/:id')
  updateRecord(
    @Param('id') id: string,
    @Body() input: UpdateBrandIpRecordInput,
  ) {
    return this.service.updateRecord(id, input);
  }

  @Post('records/:id/review')
  submitForReview(@Param('id') id: string) {
    return this.service.submitForReview(id);
  }

  @Post('records/:id/activate')
  activateRecord(@Param('id') id: string) {
    return this.service.activateRecord(id);
  }

  @Post('records/:id/protect')
  protectRecord(
    @Param('id') id: string,
    @Body('registrationNumber')
    registrationNumber?: string,
  ) {
    return this.service.protectRecord(
      id,
      registrationNumber,
    );
  }

  @Post('records/:id/license')
  licenseRecord(
    @Param('id') id: string,
    @Body()
    input: {
      partner: string;
      rightsScope: RightsScope;
      territory: string;
      licenseValue: number;
      royaltyRate: number;
      licenseStartDate: string;
      licenseEndDate: string;
    },
  ) {
    return this.service.licenseRecord(
      id,
      input,
    );
  }

  @Post('records/:id/expire')
  expireRecord(@Param('id') id: string) {
    return this.service.expireRecord(id);
  }

  @Post('records/:id/archive')
  archiveRecord(@Param('id') id: string) {
    return this.service.archiveRecord(id);
  }

  @Post('records/:id/reject')
  rejectRecord(@Param('id') id: string) {
    return this.service.rejectRecord(id);
  }

  @Post('records/:id/license-revenue')
  calculateLicenseRevenue(
    @Param('id') id: string,
    @Body('grossRevenue')
    grossRevenue: number,
  ) {
    return this.service.calculateLicenseRevenue(
      id,
      grossRevenue,
    );
  }

  @Delete('records/:id')
  removeRecord(@Param('id') id: string) {
    return this.service.removeRecord(id);
  }
}
