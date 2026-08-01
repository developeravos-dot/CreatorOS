import { Module } from '@nestjs/common';

import {
  ChannelIntelligenceModule,
} from '../channel-intelligence/channel-intelligence.module';

import {
  ContentIntelligenceModule,
} from '../content-intelligence/content-intelligence.module';

import {
  AudienceIntelligenceModule,
} from '../audience-intelligence/audience-intelligence.module';

import {
  TrendIntelligenceModule,
} from '../trend-intelligence/trend-intelligence.module';

import {
  SeoIntelligenceModule,
} from '../seo-intelligence/seo-intelligence.module';

@Module({
  imports: [
    ChannelIntelligenceModule,
    ContentIntelligenceModule,
    AudienceIntelligenceModule,
    TrendIntelligenceModule,
    SeoIntelligenceModule,
  ],
  exports: [
    ChannelIntelligenceModule,
    ContentIntelligenceModule,
    AudienceIntelligenceModule,
    TrendIntelligenceModule,
    SeoIntelligenceModule,
  ],
})
export class YoutubeIntelligenceMegaModule {}
