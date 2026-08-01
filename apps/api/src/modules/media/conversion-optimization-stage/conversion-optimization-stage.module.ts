import { Module } from '@nestjs/common';
import { ConversionOptimizationStageController } from './conversion-optimization-stage.controller';
import { ConversionOptimizationStageService } from './conversion-optimization-stage.service';

@Module({
  controllers: [ConversionOptimizationStageController],
  providers: [ConversionOptimizationStageService],
  exports: [ConversionOptimizationStageService],
})
export class ConversionOptimizationStageModule {}
