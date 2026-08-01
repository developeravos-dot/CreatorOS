import { Module } from '@nestjs/common';

import {
  SeoIntelligenceController,
} from './seo-intelligence.controller';

import {
  SeoIntelligenceService,
} from './seo-intelligence.service';

@Module({
  controllers: [SeoIntelligenceController],
  providers: [SeoIntelligenceService],
  exports: [SeoIntelligenceService],
})
export class SeoIntelligenceModule {}
