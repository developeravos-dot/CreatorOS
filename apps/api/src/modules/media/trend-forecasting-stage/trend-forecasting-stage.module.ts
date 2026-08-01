import { Module } from '@nestjs/common';
import { TrendForecastingStageController } from './trend-forecasting-stage.controller';
import { TrendForecastingStageService } from './trend-forecasting-stage.service';

@Module({
  controllers: [TrendForecastingStageController],
  providers: [TrendForecastingStageService],
  exports: [TrendForecastingStageService],
})
export class TrendForecastingStageModule {}
