import { Injectable } from '@nestjs/common';
import {
  LightingPlan,
  ScriptPackage,
  VisualStyleProfile,
} from '../creative-intelligence.types';

@Injectable()
export class LightingIntelligenceService {
  build(
    script: ScriptPackage,
    visual: VisualStyleProfile,
  ): LightingPlan {
    return {
      scenes: script.scenes.map((scene, index) => ({
        sceneOrder: scene.order,
        setup: index === 0 ? 'high-impact-motivated-key' : 'motivated-three-point-or-naturalistic',
        mood: scene.purpose === 'hook' ? 'high-impact' : scene.purpose === 'resolution' ? 'open-and-resolved' : 'narrative-consistent',
        direction: index % 2 === 0 ? 'camera-left-key' : 'camera-right-key',
        contrast: visual.mode === 'documentary' ? 'natural-medium' : 'cinematic-controlled',
        colorTemperature: index % 2 === 0 ? 'balanced-warm' : 'balanced-cool',
      })),
      continuityRules: [
        'light direction continuity',
        'time-of-day continuity',
        'exposure continuity',
        'motivated-practical-light continuity',
        'skin-tone protection',
      ],
    };
  }
}