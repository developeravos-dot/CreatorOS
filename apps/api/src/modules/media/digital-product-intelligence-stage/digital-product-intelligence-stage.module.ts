import { Module } from '@nestjs/common';
import { DigitalProductIntelligenceStageController } from './digital-product-intelligence-stage.controller';
import { DigitalProductIntelligenceStageService } from './digital-product-intelligence-stage.service';

@Module({
  controllers: [DigitalProductIntelligenceStageController],
  providers: [DigitalProductIntelligenceStageService],
  exports: [DigitalProductIntelligenceStageService],
})
export class DigitalProductIntelligenceStageModule {}
