import { Module } from '@nestjs/common';

import {
  ScriptScreenplayIntelligenceModule,
} from '../script-screenplay-intelligence/script-screenplay-intelligence.module';

import {
  StoryboardShotIntelligenceModule,
} from '../storyboard-shot-intelligence/storyboard-shot-intelligence.module';

import {
  VisualProductionEngineModule,
} from '../visual-production-engine/visual-production-engine.module';

import {
  VoiceSoundMusicIntelligenceModule,
} from '../voice-sound-music-intelligence/voice-sound-music-intelligence.module';

import {
  EditingVfxQualityEngineModule,
} from '../editing-vfx-quality-engine/editing-vfx-quality-engine.module';

@Module({
  imports: [
    ScriptScreenplayIntelligenceModule,
    StoryboardShotIntelligenceModule,
    VisualProductionEngineModule,
    VoiceSoundMusicIntelligenceModule,
    EditingVfxQualityEngineModule,
  ],
  exports: [
    ScriptScreenplayIntelligenceModule,
    StoryboardShotIntelligenceModule,
    VisualProductionEngineModule,
    VoiceSoundMusicIntelligenceModule,
    EditingVfxQualityEngineModule,
  ],
})
export class AvosMediaProductionMegaModule {}
