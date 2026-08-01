import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BrandIntelligencePlatformService } from './brand-intelligence-platform.service';
import { CreativeProductionIntelligenceEngineService } from './creative-production-intelligence-engine.service';
import { MediaEcosystemService } from './media-ecosystem.service';
import {
  BrandProjectInput,
  CreativeProductionInput,
  EcosystemProjectInput,
} from './media-creative.types';

@Controller('media/intelligence')
export class MediaCreativeEcosystemBrandController {
  constructor(
    private readonly production: CreativeProductionIntelligenceEngineService,
    private readonly brand: BrandIntelligencePlatformService,
    private readonly ecosystem: MediaEcosystemService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      production: this.production.capabilities(),
      brand: this.brand.capabilities(),
      ecosystem: this.ecosystem.capabilities(),
    };
  }

  @Post('production/plans')
  createProduction(@Body() input: CreativeProductionInput) {
    return this.production.create(input);
  }

  @Get('production/plans')
  listProduction() {
    return this.production.list();
  }

  @Get('production/plans/:id')
  getProduction(@Param('id') id: string) {
    return this.production.get(id);
  }

  @Post('production/plans/:id/approve')
  approveProduction(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.production.approve(id, body.approvedBy);
  }

  @Post('production/plans/:id/start')
  startProduction(
    @Param('id') id: string,
    @Body() body: { actor: string },
  ) {
    return this.production.start(id, body.actor);
  }

  @Post('brands')
  createBrand(@Body() input: BrandProjectInput) {
    return this.brand.create(input);
  }

  @Get('brands')
  listBrands() {
    return this.brand.list();
  }

  @Get('brands/:id')
  getBrand(@Param('id') id: string) {
    return this.brand.get(id);
  }

  @Post('brands/:id/approve')
  approveBrand(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.brand.approve(id, body.approvedBy);
  }

  @Post('brands/:id/campaigns')
  addCampaign(
    @Param('id') id: string,
    @Body() body: { name: string; season: string; actor: string },
  ) {
    return this.brand.addCampaign(id, body.name, body.season, body.actor);
  }

  @Post('ecosystems')
  createEcosystem(@Body() input: EcosystemProjectInput) {
    return this.ecosystem.create(input);
  }

  @Get('ecosystems')
  listEcosystems() {
    return this.ecosystem.list();
  }

  @Get('ecosystems/dashboard')
  ecosystemDashboard() {
    return this.ecosystem.dashboard();
  }

  @Get('ecosystems/:id')
  getEcosystem(@Param('id') id: string) {
    return this.ecosystem.get(id);
  }

  @Post('ecosystems/:id/approve')
  approveEcosystem(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.ecosystem.approve(id, body.approvedBy);
  }

  @Post('ecosystems/:id/activate')
  activateEcosystem(
    @Param('id') id: string,
    @Body() body: { actor: string },
  ) {
    return this.ecosystem.activate(id, body.actor);
  }

  @Post('ecosystems/:id/metrics')
  updateMetric(
    @Param('id') id: string,
    @Body() body: { metric: string; value: number; actor: string },
  ) {
    return this.ecosystem.updateMetric(id, body.metric, body.value, body.actor);
  }

  @Post('ecosystems/:id/ip')
  addIp(
    @Param('id') id: string,
    @Body() body: { title: string; actor: string },
  ) {
    return this.ecosystem.addIp(id, body.title, body.actor);
  }
}