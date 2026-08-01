import { Module } from '@nestjs/common';

import {
  MediaResearchIntelligenceController,
} from './media-research-intelligence.controller';

import {
  MediaResearchIntelligenceService,
} from './media-research-intelligence.service';

@Module({
  controllers: [MediaResearchIntelligenceController],
  providers: [MediaResearchIntelligenceService],
  exports: [MediaResearchIntelligenceService],
})
export class MediaResearchIntelligenceModule {}
