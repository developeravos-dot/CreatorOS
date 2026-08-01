import { Module } from '@nestjs/common';

import {
  IdeaGeneratorModule,
} from '../idea-generator/idea-generator.module';

import {
  ScriptIntelligenceModule,
} from '../script-intelligence/script-intelligence.module';

import {
  VoiceProductionModule,
} from '../voice-production/voice-production.module';

import {
  VideoProductionModule,
} from '../video-production/video-production.module';

import {
  AssetLibraryModule,
} from '../asset-library/asset-library.module';

@Module({
  imports: [
    IdeaGeneratorModule,
    ScriptIntelligenceModule,
    VoiceProductionModule,
    VideoProductionModule,
    AssetLibraryModule,
  ],
  exports: [
    IdeaGeneratorModule,
    ScriptIntelligenceModule,
    VoiceProductionModule,
    VideoProductionModule,
    AssetLibraryModule,
  ],
})
export class YoutubeContentProductionMegaModule {}
