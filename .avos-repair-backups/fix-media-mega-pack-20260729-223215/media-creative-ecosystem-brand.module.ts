import { Module } from '@nestjs/common';
import { BrandIntelligencePlatformService } from './brand-intelligence-platform.service';
import { CreativeProductionIntelligenceEngineService } from './creative-production-intelligence-engine.service';
import { MediaCreativeEcosystemBrandController } from './media-creative-ecosystem-brand.controller';
import { MediaEcosystemService } from './media-ecosystem.service';

@Module({
  controllers: [MediaCreativeEcosystemBrandController],
  providers: [
    CreativeProductionIntelligenceEngineService,
    BrandIntelligencePlatformService,
    MediaEcosystemService,
  ],
  exports: [
    CreativeProductionIntelligenceEngineService,
    BrandIntelligencePlatformService,
    MediaEcosystemService,
  ],
})
export class MediaCreativeEcosystemBrandModule {}