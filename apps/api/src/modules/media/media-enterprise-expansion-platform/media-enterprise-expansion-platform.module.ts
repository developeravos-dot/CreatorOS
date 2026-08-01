import { Module } from '@nestjs/common';
import { AiLicensingEngineService } from './ai-licensing-engine.service';
import { ContentIpBuilderService } from './content-ip-builder.service';
import { CreatorPartnershipPlatformService } from './creator-partnership-platform.service';
import { GlobalLocalizationEngineService } from './global-localization-engine.service';
import { MediaCommerceEngineService } from './media-commerce-engine.service';
import { MediaEnterpriseExpansionPlatformController } from './media-enterprise-expansion-platform.controller';
import { MediaEnterpriseExpansionPlatformService } from './media-enterprise-expansion-platform.service';
import { PortfolioGovernanceEngineService } from './portfolio-governance-engine.service';
import { RevenueIntelligenceEngineService } from './revenue-intelligence-engine.service';

@Module({
  controllers: [MediaEnterpriseExpansionPlatformController],
  providers: [
    MediaEnterpriseExpansionPlatformService,
    ContentIpBuilderService,
    GlobalLocalizationEngineService,
    AiLicensingEngineService,
    CreatorPartnershipPlatformService,
    MediaCommerceEngineService,
    RevenueIntelligenceEngineService,
    PortfolioGovernanceEngineService,
  ],
  exports: [MediaEnterpriseExpansionPlatformService],
})
export class MediaEnterpriseExpansionPlatformModule {}