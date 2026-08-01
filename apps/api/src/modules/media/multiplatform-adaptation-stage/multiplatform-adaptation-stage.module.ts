import { Module } from '@nestjs/common';
import { MultiplatformAdaptationStageController } from './multiplatform-adaptation-stage.controller';
import { MultiplatformAdaptationStageService } from './multiplatform-adaptation-stage.service';

@Module({
  controllers: [MultiplatformAdaptationStageController],
  providers: [MultiplatformAdaptationStageService],
  exports: [MultiplatformAdaptationStageService],
})
export class MultiplatformAdaptationStageModule {}
