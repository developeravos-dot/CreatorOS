import { Module } from '@nestjs/common';
import { BusinessModelIntelligenceStageController } from './business-model-intelligence-stage.controller';
import { BusinessModelIntelligenceStageService } from './business-model-intelligence-stage.service';

@Module({
  controllers: [BusinessModelIntelligenceStageController],
  providers: [BusinessModelIntelligenceStageService],
  exports: [BusinessModelIntelligenceStageService],
})
export class BusinessModelIntelligenceStageModule {}
