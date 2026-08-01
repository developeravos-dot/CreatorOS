import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BrandIntelligenceMegaPlatformService } from './brand/brand-intelligence-mega-platform.service';
import { MediaEcosystemMegaOrchestratorService } from './ecosystem/media-ecosystem-mega-orchestrator.service';
import {
  BrandBrief,
  CreativeBrief,
  EcosystemBrief,
} from './media-mega.types';
import { CreativeProductionMegaEngineService } from './production/creative-production-mega-engine.service';

@Controller('media/intelligence/mega')
export class MediaCreativeMegaController {
  constructor(
    private readonly production: CreativeProductionMegaEngineService,
    private readonly brand: BrandIntelligenceMegaPlatformService,
    private readonly ecosystem: MediaEcosystemMegaOrchestratorService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      production: this.production.capabilities(),
      brand: this.brand.capabilities(),
      ecosystem: this.ecosystem.capabilities(),
    };
  }

  @Get('dashboard')
  dashboard() {
    return {
      production: this.production.dashboard(),
      brand: this.brand.dashboard(),
      ecosystem: this.ecosystem.dashboard(),
    };
  }

  @Post('production')
  createProduction(@Body() body: CreativeBrief) {
    return this.production.create(body);
  }

  @Get('production')
  listProduction() {
    return this.production.list();
  }

  @Get('production/:id')
  getProduction(@Param('id') id: string) {
    return this.production.get(id);
  }

  @Post('production/:id/approve')
  approveProduction(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.production.approve(id, body.approvedBy);
  }

  @Post('production/:id/activate')
  activateProduction(
    @Param('id') id: string,
    @Body() body: { actor: string },
  ) {
    return this.production.activate(id, body.actor);
  }

  @Post('production/:id/scenes/:sceneId/complete')
  completeScene(
    @Param('id') id: string,
    @Param('sceneId') sceneId: string,
    @Body() body: { actor: string },
  ) {
    return this.production.completeScene(id, sceneId, body.actor);
  }

  @Post('production/:id/learn')
  productionLearn(
    @Param('id') id: string,
    @Body() body: { lesson: string; actor: string },
  ) {
    return this.production.learn(id, body.lesson, body.actor);
  }

  @Post('brands')
  createBrand(@Body() body: BrandBrief) {
    return this.brand.create(body);
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
  addBrandCampaign(
    @Param('id') id: string,
    @Body() body: { name: string; season: string; actor: string },
  ) {
    return this.brand.addCampaign(id, body.name, body.season, body.actor);
  }

  @Post('brands/:id/evolve')
  evolveBrand(
    @Param('id') id: string,
    @Body() body: { recommendation: string; actor: string },
  ) {
    return this.brand.evolve(id, body.recommendation, body.actor);
  }

  @Post('ecosystems')
  createEcosystem(@Body() body: EcosystemBrief) {
    return this.ecosystem.create(body);
  }

  @Get('ecosystems')
  listEcosystems() {
    return this.ecosystem.list();
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
  updateEcosystemMetric(
    @Param('id') id: string,
    @Body() body: { metric: string; value: number; actor: string },
  ) {
    return this.ecosystem.updateMetric(id, body.metric, body.value, body.actor);
  }

  @Post('ecosystems/:id/portfolio')
  addPortfolioAsset(
    @Param('id') id: string,
    @Body() body: { title: string; actor: string },
  ) {
    return this.ecosystem.addPortfolioAsset(id, body.title, body.actor);
  }

  @Post('ecosystems/:id/learn')
  ecosystemLearn(
    @Param('id') id: string,
    @Body() body: { learning: string; actor: string },
  ) {
    return this.ecosystem.retainLearning(id, body.learning, body.actor);
  }
}