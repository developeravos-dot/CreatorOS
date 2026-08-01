import { Module } from '@nestjs/common';
import { CampaignCreativeStageController } from './campaign-creative-stage.controller';
import { CampaignCreativeStageService } from './campaign-creative-stage.service';

@Module({
  controllers: [CampaignCreativeStageController],
  providers: [CampaignCreativeStageService],
  exports: [CampaignCreativeStageService],
})
export class CampaignCreativeStageModule {}
