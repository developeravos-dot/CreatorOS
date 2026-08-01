import { Module } from '@nestjs/common';

import {
  ReleasePerformanceIntelligenceController,
} from './release-performance-intelligence.controller';

import {
  ReleasePerformanceIntelligenceService,
} from './release-performance-intelligence.service';

@Module({
  controllers: [ReleasePerformanceIntelligenceController],
  providers: [ReleasePerformanceIntelligenceService],
  exports: [ReleasePerformanceIntelligenceService],
})
export class ReleasePerformanceIntelligenceModule {}
