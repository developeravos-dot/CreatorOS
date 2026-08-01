import { Module } from '@nestjs/common';
import { BrandAssetsEngineService } from './brand/brand-assets-engine.service';
import { BrandIdentityEngineService } from './brand/brand-identity-engine.service';
import { BrandIntelligenceMegaPlatformService } from './brand/brand-intelligence-mega-platform.service';
import { BrandQualityEngineService } from './brand/brand-quality-engine.service';
import { BrandStrategyEngineService } from './brand/brand-strategy-engine.service';
import { EcosystemIntelligenceEngineService } from './ecosystem/ecosystem-intelligence-engine.service';
import { EcosystemInvestmentEngineService } from './ecosystem/ecosystem-investment-engine.service';
import { MediaEcosystemMegaOrchestratorService } from './ecosystem/media-ecosystem-mega-orchestrator.service';
import { EcosystemOrganizationEngineService } from './ecosystem/ecosystem-organization-engine.service';
import { EcosystemPortfolioEngineService } from './ecosystem/ecosystem-portfolio-engine.service';
import { MediaCreativeMegaController } from './media-creative-mega.controller';
import { CreativeProductionMegaEngineService } from './production/creative-production-mega-engine.service';
import { ProductionBlueprintEngineService } from './production/production-blueprint-engine.service';
import { ProductionCouncilService } from './production/production-council.service';
import { ProductionIntelligenceAnalyzerService } from './production/production-intelligence-analyzer.service';
import { ProductionModelRouterService } from './production/production-model-router.service';
import { ProductionQualityEngineService } from './production/production-quality-engine.service';

@Module({
  controllers: [MediaCreativeMegaController],
  providers: [
    ProductionIntelligenceAnalyzerService,
    ProductionModelRouterService,
    ProductionCouncilService,
    ProductionBlueprintEngineService,
    ProductionQualityEngineService,
    CreativeProductionMegaEngineService,
    BrandStrategyEngineService,
    BrandIdentityEngineService,
    BrandAssetsEngineService,
    BrandQualityEngineService,
    BrandIntelligenceMegaPlatformService,
    EcosystemOrganizationEngineService,
    EcosystemIntelligenceEngineService,
    EcosystemPortfolioEngineService,
    EcosystemInvestmentEngineService,
    MediaEcosystemMegaOrchestratorService,
  ],
  exports: [
    CreativeProductionMegaEngineService,
    BrandIntelligenceMegaPlatformService,
    MediaEcosystemMegaOrchestratorService,
  ],
})
export class MediaCreativeMegaModule {}