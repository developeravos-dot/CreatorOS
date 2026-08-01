import { Module } from '@nestjs/common';
import { BrandIntelligencePlatformService } from './brand-intelligence-platform.service';
import { CreativeBrandEcosystemController } from './creative-brand-ecosystem.controller';
import { CreativeBrandEcosystemService } from './creative-brand-ecosystem.service';
import { CreativeProductionIntelligenceService } from './creative-production-intelligence.service';
import { MediaEcosystemService } from './media-ecosystem.service';

@Module({
  controllers: [CreativeBrandEcosystemController],
  providers: [
    CreativeProductionIntelligenceService,
    BrandIntelligencePlatformService,
    MediaEcosystemService,
    CreativeBrandEcosystemService,
  ],
  exports: [
    CreativeProductionIntelligenceService,
    BrandIntelligencePlatformService,
    MediaEcosystemService,
    CreativeBrandEcosystemService,
  ],
})
export class CreativeBrandEcosystemModule {}