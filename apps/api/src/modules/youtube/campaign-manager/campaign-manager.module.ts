import { Module } from '@nestjs/common';

import {
  CampaignManagerController,
} from './campaign-manager.controller';

import {
  CampaignManagerService,
} from './campaign-manager.service';

@Module({
  controllers: [CampaignManagerController],
  providers: [CampaignManagerService],
  exports: [CampaignManagerService],
})
export class CampaignManagerModule {}
