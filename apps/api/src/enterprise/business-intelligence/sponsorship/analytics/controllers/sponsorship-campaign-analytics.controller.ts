import { Controller, Get } from '@nestjs/common';
import { SponsorshipCampaignAnalyticsService } from '../services/sponsorship-campaign-analytics.service';

@Controller('enterprise/business-intelligence/sponsorship/analytics')
export class SponsorshipCampaignAnalyticsController {
  constructor(
    private readonly service: SponsorshipCampaignAnalyticsService,
  ) {}

  @Get('status')
  status() {
    return this.service.status();
  }

  @Get('dashboard')
  dashboard() {
    return this.service.dashboard();
  }
}
