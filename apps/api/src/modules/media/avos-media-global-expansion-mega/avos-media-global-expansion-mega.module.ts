import { Module } from '@nestjs/common';

import {
  ExpansionReadinessStageModule,
} from '../expansion-readiness-stage/expansion-readiness-stage.module';
import {
  MarketSelectionStageModule,
} from '../market-selection-stage/market-selection-stage.module';
import {
  LocalAudienceIntelligenceStageModule,
} from '../local-audience-intelligence-stage/local-audience-intelligence-stage.module';
import {
  TranslationLocalizationStageModule,
} from '../translation-localization-stage/translation-localization-stage.module';
import {
  CulturalAdaptationStageModule,
} from '../cultural-adaptation-stage/cultural-adaptation-stage.module';
import {
  RegionalChannelLaunchStageModule,
} from '../regional-channel-launch-stage/regional-channel-launch-stage.module';
import {
  PartnerCreatorNetworkStageModule,
} from '../partner-creator-network-stage/partner-creator-network-stage.module';
import {
  MultiPlatformDistributionStageModule,
} from '../multi-platform-distribution-stage/multi-platform-distribution-stage.module';
import {
  AdvertisingExpansionStageModule,
} from '../advertising-expansion-stage/advertising-expansion-stage.module';
import {
  CommerceProductExpansionStageModule,
} from '../commerce-product-expansion-stage/commerce-product-expansion-stage.module';
import {
  LicensingFranchiseExpansionStageModule,
} from '../licensing-franchise-expansion-stage/licensing-franchise-expansion-stage.module';
import {
  RevenueOptimizationStageModule,
} from '../revenue-optimization-stage/revenue-optimization-stage.module';
import {
  GlobalRiskGovernanceStageModule,
} from '../global-risk-governance-stage/global-risk-governance-stage.module';
import {
  MarketPerformanceIntelligenceStageModule,
} from '../market-performance-intelligence-stage/market-performance-intelligence-stage.module';
import {
  ProfitReinvestmentStageModule,
} from '../profit-reinvestment-stage/profit-reinvestment-stage.module';

const GlobalExpansionModules = [
  ExpansionReadinessStageModule,
  MarketSelectionStageModule,
  LocalAudienceIntelligenceStageModule,
  TranslationLocalizationStageModule,
  CulturalAdaptationStageModule,
  RegionalChannelLaunchStageModule,
  PartnerCreatorNetworkStageModule,
  MultiPlatformDistributionStageModule,
  AdvertisingExpansionStageModule,
  CommerceProductExpansionStageModule,
  LicensingFranchiseExpansionStageModule,
  RevenueOptimizationStageModule,
  GlobalRiskGovernanceStageModule,
  MarketPerformanceIntelligenceStageModule,
  ProfitReinvestmentStageModule,
];

@Module({
  imports: GlobalExpansionModules,
  exports: GlobalExpansionModules,
})
export class AvosMediaGlobalExpansionMegaModule {}
