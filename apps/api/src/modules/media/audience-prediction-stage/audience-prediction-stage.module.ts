import { Module } from '@nestjs/common';
import { AudiencePredictionStageController } from './audience-prediction-stage.controller';
import { AudiencePredictionStageService } from './audience-prediction-stage.service';

@Module({
  controllers: [AudiencePredictionStageController],
  providers: [AudiencePredictionStageService],
  exports: [AudiencePredictionStageService],
})
export class AudiencePredictionStageModule {}
