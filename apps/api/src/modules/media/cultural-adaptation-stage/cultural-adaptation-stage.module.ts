import { Module } from '@nestjs/common';

import {
  CulturalAdaptationStageController,
} from './cultural-adaptation-stage.controller';

import {
  CulturalAdaptationStageService,
} from './cultural-adaptation-stage.service';

@Module({
  controllers: [CulturalAdaptationStageController],
  providers: [CulturalAdaptationStageService],
  exports: [CulturalAdaptationStageService],
})
export class CulturalAdaptationStageModule {}
