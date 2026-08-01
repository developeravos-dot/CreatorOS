import { Module } from '@nestjs/common';

import {
  CreativeProductionIntelligenceModule,
} from '../creative-production-intelligence/creative-production-intelligence.module';

import {
  MediaEcosystemModule,
} from '../media-ecosystem/media-ecosystem.module';

import {
  BrandIntelligencePlatformModule,
} from '../brand-intelligence-platform/brand-intelligence-platform.module';

import {
  BrandIdentityCreativeStudioModule,
} from '../brand-identity-creative-studio/brand-identity-creative-studio.module';

import {
  CreativeAiCouncilModule,
} from '../creative-ai-council/creative-ai-council.module';

@Module({
  imports: [
    CreativeProductionIntelligenceModule,
    MediaEcosystemModule,
    BrandIntelligencePlatformModule,
    BrandIdentityCreativeStudioModule,
    CreativeAiCouncilModule,
  ],
  exports: [
    CreativeProductionIntelligenceModule,
    MediaEcosystemModule,
    BrandIntelligencePlatformModule,
    BrandIdentityCreativeStudioModule,
    CreativeAiCouncilModule,
  ],
})
export class AvosMediaCoreMegaModule {}
