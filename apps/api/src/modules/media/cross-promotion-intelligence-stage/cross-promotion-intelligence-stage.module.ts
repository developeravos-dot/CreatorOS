import { Module } from '@nestjs/common';
import { CrossPromotionIntelligenceStageController } from './cross-promotion-intelligence-stage.controller';
import { CrossPromotionIntelligenceStageService } from './cross-promotion-intelligence-stage.service';

@Module({
  controllers: [CrossPromotionIntelligenceStageController],
  providers: [CrossPromotionIntelligenceStageService],
  exports: [CrossPromotionIntelligenceStageService],
})
export class CrossPromotionIntelligenceStageModule {}
