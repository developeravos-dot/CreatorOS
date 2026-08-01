import { Module } from '@nestjs/common';
import { AdvertisementIntelligenceEngineService } from './advertisement-intelligence-engine.service';
import { AudienceGrowthEngineService } from './audience-growth-engine.service';
import { GlobalDistributionEngineService } from './global-distribution-engine.service';
import { MarketAudienceIntelligenceEngineService } from './market-audience-intelligence-engine.service';
import { MediaGlobalOperatingSystemController } from './media-global-operating-system.controller';
import { MediaGlobalOperatingSystemService } from './media-global-operating-system.service';
import { MonetizationFinancialEngineService } from './monetization-financial-engine.service';
import { ProductionFactoryEngineService } from './production-factory-engine.service';
import { QualityGovernanceEngineService } from './quality-governance-engine.service';
import { RightsLicensingEngineService } from './rights-licensing-engine.service';
import { RiskComplianceEngineService } from './risk-compliance-engine.service';
import { SecurityResilienceEngineService } from './security-resilience-engine.service';
import { StrategyIntelligenceEngineService } from './strategy-intelligence-engine.service';

@Module({
  controllers: [MediaGlobalOperatingSystemController],
  providers: [
    MediaGlobalOperatingSystemService,
    StrategyIntelligenceEngineService,
    MarketAudienceIntelligenceEngineService,
    ProductionFactoryEngineService,
    GlobalDistributionEngineService,
    AudienceGrowthEngineService,
    AdvertisementIntelligenceEngineService,
    MonetizationFinancialEngineService,
    RightsLicensingEngineService,
    SecurityResilienceEngineService,
    QualityGovernanceEngineService,
    RiskComplianceEngineService,
  ],
  exports: [MediaGlobalOperatingSystemService],
})
export class MediaGlobalOperatingSystemModule {}