import { Module } from '@nestjs/common';
import { MultiLanguageAdaptationStageController } from './multi-language-adaptation-stage.controller';
import { MultiLanguageAdaptationStageService } from './multi-language-adaptation-stage.service';

@Module({
  controllers: [MultiLanguageAdaptationStageController],
  providers: [MultiLanguageAdaptationStageService],
  exports: [MultiLanguageAdaptationStageService],
})
export class MultiLanguageAdaptationStageModule {}
