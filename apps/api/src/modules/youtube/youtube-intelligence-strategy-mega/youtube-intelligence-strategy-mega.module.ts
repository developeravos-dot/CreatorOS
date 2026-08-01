import { Module } from '@nestjs/common';

import {
  ChannelStrategyEngineModule,
} from '../channel-strategy-engine/channel-strategy-engine.module';

import {
  TrendIntelligenceModule,
} from '../trend-intelligence/trend-intelligence.module';

import {
  OpportunityRadarModule,
} from '../opportunity-radar/opportunity-radar.module';

import {
  ContentInvestmentEngineModule,
} from '../content-investment-engine/content-investment-engine.module';

import {
  ExecutiveDecisionCenterModule,
} from '../executive-decision-center/executive-decision-center.module';

@Module({
  imports: [
    ChannelStrategyEngineModule,
    TrendIntelligenceModule,
    OpportunityRadarModule,
    ContentInvestmentEngineModule,
    ExecutiveDecisionCenterModule,
  ],
  exports: [
    ChannelStrategyEngineModule,
    TrendIntelligenceModule,
    OpportunityRadarModule,
    ContentInvestmentEngineModule,
    ExecutiveDecisionCenterModule,
  ],
})
export class YoutubeIntelligenceStrategyMegaModule {}
