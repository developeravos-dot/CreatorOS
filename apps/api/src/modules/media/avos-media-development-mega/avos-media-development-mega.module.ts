import { Module } from '@nestjs/common';

import {
  MediaResearchIntelligenceModule,
} from '../media-research-intelligence/media-research-intelligence.module';

import {
  IdeaInventionEngineModule,
} from '../idea-invention-engine/idea-invention-engine.module';

import {
  ContentConceptLabModule,
} from '../content-concept-lab/content-concept-lab.module';

import {
  StoryFormatIntelligenceModule,
} from '../story-format-intelligence/story-format-intelligence.module';

import {
  AudienceCulturalIntelligenceModule,
} from '../audience-cultural-intelligence/audience-cultural-intelligence.module';

@Module({
  imports: [
    MediaResearchIntelligenceModule,
    IdeaInventionEngineModule,
    ContentConceptLabModule,
    StoryFormatIntelligenceModule,
    AudienceCulturalIntelligenceModule,
  ],
  exports: [
    MediaResearchIntelligenceModule,
    IdeaInventionEngineModule,
    ContentConceptLabModule,
    StoryFormatIntelligenceModule,
    AudienceCulturalIntelligenceModule,
  ],
})
export class AvosMediaDevelopmentMegaModule {}
