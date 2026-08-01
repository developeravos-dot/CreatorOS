import { Module } from '@nestjs/common';
import { SponsorshipIntelligenceStageController } from './sponsorship-intelligence-stage.controller';
import { SponsorshipIntelligenceStageService } from './sponsorship-intelligence-stage.service';

@Module({
  controllers: [SponsorshipIntelligenceStageController],
  providers: [SponsorshipIntelligenceStageService],
  exports: [SponsorshipIntelligenceStageService],
})
export class SponsorshipIntelligenceStageModule {}
