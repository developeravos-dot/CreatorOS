import { Module } from '@nestjs/common';
import { AudienceEconomicIntelligenceStageController } from './audience-economic-intelligence-stage.controller';
import { AudienceEconomicIntelligenceStageService } from './audience-economic-intelligence-stage.service';

@Module({
  controllers: [AudienceEconomicIntelligenceStageController],
  providers: [AudienceEconomicIntelligenceStageService],
  exports: [AudienceEconomicIntelligenceStageService],
})
export class AudienceEconomicIntelligenceStageModule {}
