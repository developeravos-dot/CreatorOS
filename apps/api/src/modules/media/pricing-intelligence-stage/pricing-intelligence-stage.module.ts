import { Module } from '@nestjs/common';
import { PricingIntelligenceStageController } from './pricing-intelligence-stage.controller';
import { PricingIntelligenceStageService } from './pricing-intelligence-stage.service';

@Module({
  controllers: [PricingIntelligenceStageController],
  providers: [PricingIntelligenceStageService],
  exports: [PricingIntelligenceStageService],
})
export class PricingIntelligenceStageModule {}
