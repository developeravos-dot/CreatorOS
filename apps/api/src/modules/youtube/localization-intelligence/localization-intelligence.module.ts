import { Module } from '@nestjs/common';

import {
  LocalizationIntelligenceController,
} from './localization-intelligence.controller';

import {
  LocalizationIntelligenceService,
} from './localization-intelligence.service';

@Module({
  controllers: [LocalizationIntelligenceController],
  providers: [LocalizationIntelligenceService],
  exports: [LocalizationIntelligenceService],
})
export class LocalizationIntelligenceModule {}
