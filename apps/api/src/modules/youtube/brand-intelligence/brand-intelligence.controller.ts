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
  BrandIntelligenceService,
  BrandProfileStatus,
  BrandTone,
  CreateBrandAssetInput,
  CreateBrandProfileInput,
  UpdateBrandProfileInput,
} from './brand-intelligence.service';

@Controller('youtube/brand-intelligence')
export class BrandIntelligenceController {
  constructor(
    private readonly brandIntelligenceService: BrandIntelligenceService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.brandIntelligenceService.getDashboard();
  }

  @Get('brands')
  listBrands(
    @Query('status') status?: BrandProfileStatus,
    @Query('tone') tone?: BrandTone,
    @Query('search') search?: string,
  ) {
    return this.brandIntelligenceService.listBrands({
      status,
      tone,
      search,
    });
  }

  @Get('brands/:id')
  getBrand(@Param('id') id: string) {
    return this.brandIntelligenceService.getBrand(id);
  }

  @Post('brands')
  createBrand(
    @Body() input: CreateBrandProfileInput,
  ) {
    return this.brandIntelligenceService.createBrand(input);
  }

  @Patch('brands/:id')
  updateBrand(
    @Param('id') id: string,
    @Body() input: UpdateBrandProfileInput,
  ) {
    return this.brandIntelligenceService.updateBrand(
      id,
      input,
    );
  }

  @Delete('brands/:id')
  removeBrand(@Param('id') id: string) {
    return this.brandIntelligenceService.removeBrand(id);
  }

  @Post('brands/:id/assets')
  addAsset(
    @Param('id') id: string,
    @Body() input: CreateBrandAssetInput,
  ) {
    return this.brandIntelligenceService.addAsset(
      id,
      input,
    );
  }

  @Delete('brands/:id/assets/:assetId')
  removeAsset(
    @Param('id') id: string,
    @Param('assetId') assetId: string,
  ) {
    return this.brandIntelligenceService.removeAsset(
      id,
      assetId,
    );
  }

  @Post('brands/:id/analyze')
  analyzeContent(
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    return this.brandIntelligenceService.analyzeContent(
      id,
      content,
    );
  }

  @Get('brands/:id/brief')
  generateBrandBrief(@Param('id') id: string) {
    return this.brandIntelligenceService.generateBrandBrief(
      id,
    );
  }
}
