import { Module } from '@nestjs/common';

import {
  MediaRiskIncidentEngineController,
} from './media-risk-incident-engine.controller';

import {
  MediaRiskIncidentEngineService,
} from './media-risk-incident-engine.service';

@Module({
  controllers: [MediaRiskIncidentEngineController],
  providers: [MediaRiskIncidentEngineService],
  exports: [MediaRiskIncidentEngineService],
})
export class MediaRiskIncidentEngineModule {}
