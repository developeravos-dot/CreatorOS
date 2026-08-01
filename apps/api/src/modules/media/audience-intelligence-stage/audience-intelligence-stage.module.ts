import { Module } from '@nestjs/common';
import { AudienceIntelligenceStageController } from './audience-intelligence-stage.controller';
import { AudienceIntelligenceStageService } from './audience-intelligence-stage.service';

@Module({
  controllers: [AudienceIntelligenceStageController],
  providers: [AudienceIntelligenceStageService],
  exports: [AudienceIntelligenceStageService],
})
export class AudienceIntelligenceStageModule {}
