import { Module } from '@nestjs/common';
import { CashFlowIntelligenceStageController } from './cash-flow-intelligence-stage.controller';
import { CashFlowIntelligenceStageService } from './cash-flow-intelligence-stage.service';

@Module({
  controllers: [CashFlowIntelligenceStageController],
  providers: [CashFlowIntelligenceStageService],
  exports: [CashFlowIntelligenceStageService],
})
export class CashFlowIntelligenceStageModule {}
