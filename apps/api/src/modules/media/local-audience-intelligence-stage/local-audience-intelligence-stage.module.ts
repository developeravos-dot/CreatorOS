import { Module } from '@nestjs/common';

import {
  LocalAudienceIntelligenceStageController,
} from './local-audience-intelligence-stage.controller';

import {
  LocalAudienceIntelligenceStageService,
} from './local-audience-intelligence-stage.service';

@Module({
  controllers: [LocalAudienceIntelligenceStageController],
  providers: [LocalAudienceIntelligenceStageService],
  exports: [LocalAudienceIntelligenceStageService],
})
export class LocalAudienceIntelligenceStageModule {}
