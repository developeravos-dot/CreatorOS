import { Module } from '@nestjs/common';
import { CommunityIntelligenceStageController } from './community-intelligence-stage.controller';
import { CommunityIntelligenceStageService } from './community-intelligence-stage.service';

@Module({
  controllers: [CommunityIntelligenceStageController],
  providers: [CommunityIntelligenceStageService],
  exports: [CommunityIntelligenceStageService],
})
export class CommunityIntelligenceStageModule {}
