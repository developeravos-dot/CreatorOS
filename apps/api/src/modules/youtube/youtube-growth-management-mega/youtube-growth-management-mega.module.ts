import { Module } from '@nestjs/common';

import {
  CampaignManagerModule,
} from '../campaign-manager/campaign-manager.module';

import {
  AbTestingEngineModule,
} from '../ab-testing-engine/ab-testing-engine.module';

import {
  NotificationCenterModule,
} from '../notification-center/notification-center.module';

import {
  ReportingEngineModule,
} from '../reporting-engine/reporting-engine.module';

import {
  GrowthIntelligenceModule,
} from '../growth-intelligence/growth-intelligence.module';

@Module({
  imports: [
    CampaignManagerModule,
    AbTestingEngineModule,
    NotificationCenterModule,
    ReportingEngineModule,
    GrowthIntelligenceModule,
  ],
  exports: [
    CampaignManagerModule,
    AbTestingEngineModule,
    NotificationCenterModule,
    ReportingEngineModule,
    GrowthIntelligenceModule,
  ],
})
export class YoutubeGrowthManagementMegaModule {}
