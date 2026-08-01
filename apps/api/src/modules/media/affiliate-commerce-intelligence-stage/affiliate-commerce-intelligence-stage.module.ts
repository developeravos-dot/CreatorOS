import { Module } from '@nestjs/common';
import { AffiliateCommerceIntelligenceStageController } from './affiliate-commerce-intelligence-stage.controller';
import { AffiliateCommerceIntelligenceStageService } from './affiliate-commerce-intelligence-stage.service';

@Module({
  controllers: [AffiliateCommerceIntelligenceStageController],
  providers: [AffiliateCommerceIntelligenceStageService],
  exports: [AffiliateCommerceIntelligenceStageService],
})
export class AffiliateCommerceIntelligenceStageModule {}
