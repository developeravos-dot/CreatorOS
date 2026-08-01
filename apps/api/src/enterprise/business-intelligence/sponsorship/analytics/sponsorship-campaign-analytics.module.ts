import { Module } from '@nestjs/common';
import { SponsorshipCampaignAnalyticsController } from './controllers/sponsorship-campaign-analytics.controller';
import { SponsorshipCampaignAnalyticsService } from './services/sponsorship-campaign-analytics.service';

@Module({
  controllers: [
    SponsorshipCampaignAnalyticsController,
  ],
  providers: [
    SponsorshipCampaignAnalyticsService,
  ],
  exports: [
    SponsorshipCampaignAnalyticsService,
  ],
})
export class SponsorshipCampaignAnalyticsModule {}
