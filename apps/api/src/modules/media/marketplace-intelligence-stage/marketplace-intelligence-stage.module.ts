import { Module } from '@nestjs/common';
import { MarketplaceIntelligenceStageController } from './marketplace-intelligence-stage.controller';
import { MarketplaceIntelligenceStageService } from './marketplace-intelligence-stage.service';

@Module({
  controllers: [MarketplaceIntelligenceStageController],
  providers: [MarketplaceIntelligenceStageService],
  exports: [MarketplaceIntelligenceStageService],
})
export class MarketplaceIntelligenceStageModule {}
