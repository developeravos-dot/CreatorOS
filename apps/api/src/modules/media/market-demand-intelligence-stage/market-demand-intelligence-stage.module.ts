import { Module } from '@nestjs/common';
import { MarketDemandIntelligenceStageController } from './market-demand-intelligence-stage.controller';
import { MarketDemandIntelligenceStageService } from './market-demand-intelligence-stage.service';

@Module({
  controllers: [MarketDemandIntelligenceStageController],
  providers: [MarketDemandIntelligenceStageService],
  exports: [MarketDemandIntelligenceStageService],
})
export class MarketDemandIntelligenceStageModule {}
