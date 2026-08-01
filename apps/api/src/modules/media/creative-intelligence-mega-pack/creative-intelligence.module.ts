import { Module } from '@nestjs/common';
import { AudioIntelligenceService } from './audio/audio-intelligence.service';
import { CameraIntelligenceService } from './camera/camera-intelligence.service';
import { CharacterIntelligenceService } from './character/character-intelligence.service';
import { CreativeIntelligenceController } from './creative-intelligence.controller';
import { CreativeIntelligenceOrchestratorService } from './creative-intelligence-orchestrator.service';
import { EditingIntelligenceService } from './editing/editing-intelligence.service';
import { LightingIntelligenceService } from './lighting/lighting-intelligence.service';
import { MusicIntelligenceService } from './music/music-intelligence.service';
import { CreativeQualityIntelligenceService } from './quality/creative-quality-intelligence.service';
import { ScriptIntelligenceService } from './script/script-intelligence.service';
import { StoryIntelligenceService } from './story/story-intelligence.service';
import { ThumbnailIntelligenceService } from './thumbnail/thumbnail-intelligence.service';
import { VisualStyleIntelligenceService } from './visual/visual-style-intelligence.service';
import { VoiceIntelligenceService } from './voice/voice-intelligence.service';
import { WorldBuildingIntelligenceService } from './world/world-building-intelligence.service';

@Module({
  controllers: [CreativeIntelligenceController],
  providers: [
    StoryIntelligenceService,
    ScriptIntelligenceService,
    CharacterIntelligenceService,
    WorldBuildingIntelligenceService,
    VisualStyleIntelligenceService,
    CameraIntelligenceService,
    LightingIntelligenceService,
    AudioIntelligenceService,
    MusicIntelligenceService,
    VoiceIntelligenceService,
    EditingIntelligenceService,
    ThumbnailIntelligenceService,
    CreativeQualityIntelligenceService,
    CreativeIntelligenceOrchestratorService,
  ],
  exports: [CreativeIntelligenceOrchestratorService],
})
export class CreativeIntelligenceModule {}