import { Module } from '@nestjs/common';
import { MerchandiseCommerceIntelligenceStageController } from './merchandise-commerce-intelligence-stage.controller';
import { MerchandiseCommerceIntelligenceStageService } from './merchandise-commerce-intelligence-stage.service';

@Module({
  controllers: [MerchandiseCommerceIntelligenceStageController],
  providers: [MerchandiseCommerceIntelligenceStageService],
  exports: [MerchandiseCommerceIntelligenceStageService],
})
export class MerchandiseCommerceIntelligenceStageModule {}
