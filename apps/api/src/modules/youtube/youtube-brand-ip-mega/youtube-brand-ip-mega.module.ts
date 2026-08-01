import { Module } from '@nestjs/common';

import {
  BrandIdentityEngineModule,
} from '../brand-identity-engine/brand-identity-engine.module';

import {
  ContentIpBuilderModule,
} from '../content-ip-builder/content-ip-builder.module';

import {
  LicensingIntelligenceModule,
} from '../licensing-intelligence/licensing-intelligence.module';

import {
  RightsManagementModule,
} from '../rights-management/rights-management.module';

import {
  PartnershipIntelligenceModule,
} from '../partnership-intelligence/partnership-intelligence.module';

@Module({
  imports: [
    BrandIdentityEngineModule,
    ContentIpBuilderModule,
    LicensingIntelligenceModule,
    RightsManagementModule,
    PartnershipIntelligenceModule,
  ],
  exports: [
    BrandIdentityEngineModule,
    ContentIpBuilderModule,
    LicensingIntelligenceModule,
    RightsManagementModule,
    PartnershipIntelligenceModule,
  ],
})
export class YoutubeBrandIpMegaModule {}
