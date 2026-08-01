import { Module } from '@nestjs/common';

import {
  LocalizationIntelligenceModule,
} from '../localization-intelligence/localization-intelligence.module';

import {
  MultilingualContentEngineModule,
} from '../multilingual-content-engine/multilingual-content-engine.module';

import {
  MarketExpansionEngineModule,
} from '../market-expansion-engine/market-expansion-engine.module';

import {
  RegionalComplianceEngineModule,
} from '../regional-compliance-engine/regional-compliance-engine.module';

import {
  GlobalDistributionCenterModule,
} from '../global-distribution-center/global-distribution-center.module';

@Module({
  imports: [
    LocalizationIntelligenceModule,
    MultilingualContentEngineModule,
    MarketExpansionEngineModule,
    RegionalComplianceEngineModule,
    GlobalDistributionCenterModule,
  ],
  exports: [
    LocalizationIntelligenceModule,
    MultilingualContentEngineModule,
    MarketExpansionEngineModule,
    RegionalComplianceEngineModule,
    GlobalDistributionCenterModule,
  ],
})
export class YoutubeGlobalExpansionMegaModule {}
