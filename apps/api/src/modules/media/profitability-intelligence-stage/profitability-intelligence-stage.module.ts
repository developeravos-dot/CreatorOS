import { Module } from '@nestjs/common';
import { ProfitabilityIntelligenceStageController } from './profitability-intelligence-stage.controller';
import { ProfitabilityIntelligenceStageService } from './profitability-intelligence-stage.service';

@Module({
  controllers: [ProfitabilityIntelligenceStageController],
  providers: [ProfitabilityIntelligenceStageService],
  exports: [ProfitabilityIntelligenceStageService],
})
export class ProfitabilityIntelligenceStageModule {}
