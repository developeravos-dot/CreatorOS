import { Module } from '@nestjs/common';

import {
  RevenueIntelligenceModule,
} from '../revenue-intelligence/revenue-intelligence.module';

import {
  SponsorshipManagerModule,
} from '../sponsorship-manager/sponsorship-manager.module';

import {
  AffiliateCommerceModule,
} from '../affiliate-commerce/affiliate-commerce.module';

import {
  DigitalProductsEngineModule,
} from '../digital-products-engine/digital-products-engine.module';

import {
  MonetizationDashboardModule,
} from '../monetization-dashboard/monetization-dashboard.module';

@Module({
  imports: [
    RevenueIntelligenceModule,
    SponsorshipManagerModule,
    AffiliateCommerceModule,
    DigitalProductsEngineModule,
    MonetizationDashboardModule,
  ],
  exports: [
    RevenueIntelligenceModule,
    SponsorshipManagerModule,
    AffiliateCommerceModule,
    DigitalProductsEngineModule,
    MonetizationDashboardModule,
  ],
})
export class YoutubeMonetizationMegaModule {}
