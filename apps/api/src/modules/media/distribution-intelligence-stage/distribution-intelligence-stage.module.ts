import { Module } from '@nestjs/common';
import { DistributionIntelligenceStageController } from './distribution-intelligence-stage.controller';
import { DistributionIntelligenceStageService } from './distribution-intelligence-stage.service';

@Module({
  controllers: [DistributionIntelligenceStageController],
  providers: [DistributionIntelligenceStageService],
  exports: [DistributionIntelligenceStageService],
})
export class DistributionIntelligenceStageModule {}
