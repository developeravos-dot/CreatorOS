import { Body, Controller, Get, Post } from '@nestjs/common';
import { BrandIntelligenceInput, BrandIntelligenceService } from './brand-intelligence.service';
import { CreativeProductionIntelligenceService, ProductionIntelligenceInput } from './creative-production-intelligence.service';
import { MediaEcosystemInput, MediaEcosystemIntelligenceService } from './media-ecosystem-intelligence.service';
import { CreateMediaIntelligenceProjectInput, MediaIntelligencePlatformService } from './media-intelligence-platform.service';

@Controller('media/intelligence')
export class MediaIntelligencePlatformController {
  constructor(
    private readonly platform: MediaIntelligencePlatformService,
    private readonly brand: BrandIntelligenceService,
    private readonly production: CreativeProductionIntelligenceService,
    private readonly ecosystem: MediaEcosystemIntelligenceService,
  ) {}

  @Get('capabilities')
  getCapabilities() { return this.platform.getCapabilities(); }

  @Post('projects')
  createProject(@Body() input: CreateMediaIntelligenceProjectInput) {
    return this.platform.createIntegratedProject(input);
  }

  @Post('brand/blueprints')
  createBrand(@Body() input: BrandIntelligenceInput) { return this.brand.createBlueprint(input); }

  @Post('production/plans')
  createProduction(@Body() input: ProductionIntelligenceInput) { return this.production.createProductionPlan(input); }

  @Post('ecosystem/plans')
  createEcosystem(@Body() input: MediaEcosystemInput) { return this.ecosystem.createEcosystemPlan(input); }
}
