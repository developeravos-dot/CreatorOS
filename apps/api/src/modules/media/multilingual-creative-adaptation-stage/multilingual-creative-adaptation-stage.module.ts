import { Module } from '@nestjs/common';
import { MultilingualCreativeAdaptationStageController } from './multilingual-creative-adaptation-stage.controller';
import { MultilingualCreativeAdaptationStageService } from './multilingual-creative-adaptation-stage.service';

@Module({
  controllers: [MultilingualCreativeAdaptationStageController],
  providers: [MultilingualCreativeAdaptationStageService],
  exports: [MultilingualCreativeAdaptationStageService],
})
export class MultilingualCreativeAdaptationStageModule {}
