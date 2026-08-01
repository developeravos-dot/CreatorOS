import { Module } from '@nestjs/common';
import { ConceptValidationStageController } from './concept-validation-stage.controller';
import { ConceptValidationStageService } from './concept-validation-stage.service';

@Module({
  controllers: [ConceptValidationStageController],
  providers: [ConceptValidationStageService],
  exports: [ConceptValidationStageService],
})
export class ConceptValidationStageModule {}
