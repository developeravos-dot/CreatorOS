import { Module } from '@nestjs/common';
import { AdvertisingRevenueIntelligenceStageController } from './advertising-revenue-intelligence-stage.controller';
import { AdvertisingRevenueIntelligenceStageService } from './advertising-revenue-intelligence-stage.service';

@Module({
  controllers: [AdvertisingRevenueIntelligenceStageController],
  providers: [AdvertisingRevenueIntelligenceStageService],
  exports: [AdvertisingRevenueIntelligenceStageService],
})
export class AdvertisingRevenueIntelligenceStageModule {}
