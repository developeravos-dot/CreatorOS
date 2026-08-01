import { Module } from '@nestjs/common';
import { RiskReturnIntelligenceStageController } from './risk-return-intelligence-stage.controller';
import { RiskReturnIntelligenceStageService } from './risk-return-intelligence-stage.service';

@Module({
  controllers: [RiskReturnIntelligenceStageController],
  providers: [RiskReturnIntelligenceStageService],
  exports: [RiskReturnIntelligenceStageService],
})
export class RiskReturnIntelligenceStageModule {}
