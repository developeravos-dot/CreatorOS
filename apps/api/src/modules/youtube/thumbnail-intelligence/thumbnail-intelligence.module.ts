import { Module } from '@nestjs/common';

import {
  ThumbnailIntelligenceController,
} from './thumbnail-intelligence.controller';

import {
  ThumbnailIntelligenceService,
} from './thumbnail-intelligence.service';

@Module({
  controllers: [ThumbnailIntelligenceController],
  providers: [ThumbnailIntelligenceService],
  exports: [ThumbnailIntelligenceService],
})
export class ThumbnailIntelligenceModule {}
