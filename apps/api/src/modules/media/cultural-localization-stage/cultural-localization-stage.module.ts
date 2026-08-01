import { Module } from '@nestjs/common';
import { CulturalLocalizationStageController } from './cultural-localization-stage.controller';
import { CulturalLocalizationStageService } from './cultural-localization-stage.service';

@Module({
  controllers: [CulturalLocalizationStageController],
  providers: [CulturalLocalizationStageService],
  exports: [CulturalLocalizationStageService],
})
export class CulturalLocalizationStageModule {}
