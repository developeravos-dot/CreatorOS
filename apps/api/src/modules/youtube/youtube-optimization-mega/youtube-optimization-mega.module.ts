import { Module } from '@nestjs/common';

import {
  ThumbnailIntelligenceModule,
} from '../thumbnail-intelligence/thumbnail-intelligence.module';

import {
  TitleIntelligenceModule,
} from '../title-intelligence/title-intelligence.module';

import {
  DescriptionIntelligenceModule,
} from '../description-intelligence/description-intelligence.module';

import {
  TagsIntelligenceModule,
} from '../tags-intelligence/tags-intelligence.module';

import {
  PublishingIntelligenceModule,
} from '../publishing-intelligence/publishing-intelligence.module';

@Module({
  imports: [
    ThumbnailIntelligenceModule,
    TitleIntelligenceModule,
    DescriptionIntelligenceModule,
    TagsIntelligenceModule,
    PublishingIntelligenceModule,
  ],
  exports: [
    ThumbnailIntelligenceModule,
    TitleIntelligenceModule,
    DescriptionIntelligenceModule,
    TagsIntelligenceModule,
    PublishingIntelligenceModule,
  ],
})
export class YoutubeOptimizationMegaModule {}
