import { Module } from '@nestjs/common';

import {
  ConceptDevelopmentStageController,
} from './concept-development-stage.controller';

import {
  ConceptDevelopmentStageService,
} from './concept-development-stage.service';

@Module({
  controllers: [ConceptDevelopmentStageController],
  providers: [ConceptDevelopmentStageService],
  exports: [ConceptDevelopmentStageService],
})
export class ConceptDevelopmentStageModule {}
