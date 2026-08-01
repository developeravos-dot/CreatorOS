import { Module } from '@nestjs/common';
import { AudienceSharingIntelligenceStageController } from './audience-sharing-intelligence-stage.controller';
import { AudienceSharingIntelligenceStageService } from './audience-sharing-intelligence-stage.service';

@Module({
  controllers: [AudienceSharingIntelligenceStageController],
  providers: [AudienceSharingIntelligenceStageService],
  exports: [AudienceSharingIntelligenceStageService],
})
export class AudienceSharingIntelligenceStageModule {}
