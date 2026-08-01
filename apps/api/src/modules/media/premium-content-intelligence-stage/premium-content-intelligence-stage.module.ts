import { Module } from '@nestjs/common';
import { PremiumContentIntelligenceStageController } from './premium-content-intelligence-stage.controller';
import { PremiumContentIntelligenceStageService } from './premium-content-intelligence-stage.service';

@Module({
  controllers: [PremiumContentIntelligenceStageController],
  providers: [PremiumContentIntelligenceStageService],
  exports: [PremiumContentIntelligenceStageService],
})
export class PremiumContentIntelligenceStageModule {}
