import { Module } from '@nestjs/common';
import { LicensingRevenueIntelligenceStageController } from './licensing-revenue-intelligence-stage.controller';
import { LicensingRevenueIntelligenceStageService } from './licensing-revenue-intelligence-stage.service';

@Module({
  controllers: [LicensingRevenueIntelligenceStageController],
  providers: [LicensingRevenueIntelligenceStageService],
  exports: [LicensingRevenueIntelligenceStageService],
})
export class LicensingRevenueIntelligenceStageModule {}
