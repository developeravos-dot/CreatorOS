import { Module } from '@nestjs/common';
import { AudienceNetworkIntelligenceService } from './audience-network-intelligence.service';
import { GlobalDistributionIntelligenceService } from './global-distribution-intelligence.service';
import { GlobalMediaIpPlatformController } from './global-media-ip-platform.controller';
import { GlobalMediaIpPlatformService } from './global-media-ip-platform.service';
import { IntellectualPropertyLifecycleService } from './intellectual-property-lifecycle.service';
import { MonetizationCommerceIntelligenceService } from './monetization-commerce-intelligence.service';
import { PartnershipLicensingIntelligenceService } from './partnership-licensing-intelligence.service';

@Module({
  controllers: [GlobalMediaIpPlatformController],
  providers: [
    GlobalMediaIpPlatformService,
    IntellectualPropertyLifecycleService,
    GlobalDistributionIntelligenceService,
    MonetizationCommerceIntelligenceService,
    PartnershipLicensingIntelligenceService,
    AudienceNetworkIntelligenceService,
  ],
  exports: [GlobalMediaIpPlatformService],
})
export class GlobalMediaIpPlatformModule {}