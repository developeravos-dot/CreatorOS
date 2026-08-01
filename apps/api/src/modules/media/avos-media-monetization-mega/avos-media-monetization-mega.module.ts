import { Module } from '@nestjs/common';

import {
  AdvertisingRevenueEngineModule,
} from '../advertising-revenue-engine/advertising-revenue-engine.module';

import {
  SponsorshipIntelligenceEngineModule,
} from '../sponsorship-intelligence-engine/sponsorship-intelligence-engine.module';

import {
  AffiliateCommerceEngineModule,
} from '../affiliate-commerce-engine/affiliate-commerce-engine.module';

import {
  DigitalProductBusinessEngineModule,
} from '../digital-product-business-engine/digital-product-business-engine.module';

import {
  ContentLicensingRevenueEngineModule,
} from '../content-licensing-revenue-engine/content-licensing-revenue-engine.module';

@Module({
  imports: [
    AdvertisingRevenueEngineModule,
    SponsorshipIntelligenceEngineModule,
    AffiliateCommerceEngineModule,
    DigitalProductBusinessEngineModule,
    ContentLicensingRevenueEngineModule,
  ],
  exports: [
    AdvertisingRevenueEngineModule,
    SponsorshipIntelligenceEngineModule,
    AffiliateCommerceEngineModule,
    DigitalProductBusinessEngineModule,
    ContentLicensingRevenueEngineModule,
  ],
})
export class AvosMediaMonetizationMegaModule {}
