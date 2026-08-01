import { Module } from '@nestjs/common';
import { BrandIntelligenceService } from './brand-intelligence.service';
import { CreativeProductionIntelligenceService } from './creative-production-intelligence.service';
import { MediaEcosystemIntelligenceService } from './media-ecosystem-intelligence.service';
import { MediaIntelligencePlatformController } from './media-intelligence-platform.controller';
import { MediaIntelligencePlatformService } from './media-intelligence-platform.service';

@Module({
  controllers: [MediaIntelligencePlatformController],
  providers: [
    BrandIntelligenceService,
    CreativeProductionIntelligenceService,
    MediaEcosystemIntelligenceService,
    MediaIntelligencePlatformService,
  ],
  exports: [
    BrandIntelligenceService,
    CreativeProductionIntelligenceService,
    MediaEcosystemIntelligenceService,
    MediaIntelligencePlatformService,
  ],
})
export class MediaIntelligencePlatformModule {}
