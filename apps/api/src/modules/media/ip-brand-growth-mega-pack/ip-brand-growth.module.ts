import { Module } from '@nestjs/common';
import { BrandEvolutionIntelligenceService } from './brand/brand-evolution-intelligence.service';
import { FranchiseIntelligenceService } from './franchise/franchise-intelligence.service';
import { GrowthIntelligenceService } from './growth/growth-intelligence.service';
import { IpBrandGrowthController } from './ip-brand-growth.controller';
import { IpBrandGrowthOrchestratorService } from './ip-brand-growth-orchestrator.service';
import { IpIntelligenceService } from './ip/ip-intelligence.service';
import { LicensingIntelligenceService } from './licensing/licensing-intelligence.service';
import { MarketingIntelligenceService } from './marketing/marketing-intelligence.service';
import { MonetizationIntelligenceService } from './monetization/monetization-intelligence.service';
import { PartnershipIntelligenceService } from './partnership/partnership-intelligence.service';
import { IpBrandGrowthQualityService } from './quality/ip-brand-growth-quality.service';

@Module({
  controllers: [IpBrandGrowthController],
  providers: [
    IpIntelligenceService,
    FranchiseIntelligenceService,
    BrandEvolutionIntelligenceService,
    MarketingIntelligenceService,
    GrowthIntelligenceService,
    MonetizationIntelligenceService,
    PartnershipIntelligenceService,
    LicensingIntelligenceService,
    IpBrandGrowthQualityService,
    IpBrandGrowthOrchestratorService,
  ],
  exports: [IpBrandGrowthOrchestratorService],
})
export class IpBrandGrowthModule {}