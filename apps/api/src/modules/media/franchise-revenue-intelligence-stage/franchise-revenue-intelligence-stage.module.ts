import { Module } from '@nestjs/common';
import { FranchiseRevenueIntelligenceStageController } from './franchise-revenue-intelligence-stage.controller';
import { FranchiseRevenueIntelligenceStageService } from './franchise-revenue-intelligence-stage.service';

@Module({
  controllers: [FranchiseRevenueIntelligenceStageController],
  providers: [FranchiseRevenueIntelligenceStageService],
  exports: [FranchiseRevenueIntelligenceStageService],
})
export class FranchiseRevenueIntelligenceStageModule {}
