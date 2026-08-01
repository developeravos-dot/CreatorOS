import { Module } from '@nestjs/common';

import {
  AudienceIntelligenceModule,
} from '../audience-intelligence/audience-intelligence.module';

import {
  CommentIntelligenceModule,
} from '../comment-intelligence/comment-intelligence.module';

import {
  CommunityManagerModule,
} from '../community-manager/community-manager.module';

import {
  SubscriberGrowthEngineModule,
} from '../subscriber-growth-engine/subscriber-growth-engine.module';

import {
  EngagementAnalyticsModule,
} from '../engagement-analytics/engagement-analytics.module';

@Module({
  imports: [
    AudienceIntelligenceModule,
    CommentIntelligenceModule,
    CommunityManagerModule,
    SubscriberGrowthEngineModule,
    EngagementAnalyticsModule,
  ],
  exports: [
    AudienceIntelligenceModule,
    CommentIntelligenceModule,
    CommunityManagerModule,
    SubscriberGrowthEngineModule,
    EngagementAnalyticsModule,
  ],
})
export class YoutubeAudienceCommunityMegaModule {}
