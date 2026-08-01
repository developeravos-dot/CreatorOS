import { Module } from '@nestjs/common';

import {
  PublishingIntelligenceController,
} from './publishing-intelligence.controller';

import {
  PublishingIntelligenceService,
} from './publishing-intelligence.service';

@Module({
  controllers: [PublishingIntelligenceController],
  providers: [PublishingIntelligenceService],
  exports: [PublishingIntelligenceService],
})
export class PublishingIntelligenceModule {}
