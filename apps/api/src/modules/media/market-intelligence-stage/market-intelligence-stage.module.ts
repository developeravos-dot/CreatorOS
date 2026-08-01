import { Module } from '@nestjs/common';
import { MarketIntelligenceStageController } from './market-intelligence-stage.controller';
import { MarketIntelligenceStageService } from './market-intelligence-stage.service';

@Module({
  controllers: [MarketIntelligenceStageController],
  providers: [MarketIntelligenceStageService],
  exports: [MarketIntelligenceStageService],
})
export class MarketIntelligenceStageModule {}
