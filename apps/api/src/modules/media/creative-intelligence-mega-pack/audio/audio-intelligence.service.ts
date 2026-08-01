import { Injectable } from '@nestjs/common';
import {
  AudioPlan,
  ScriptPackage,
} from '../creative-intelligence.types';

@Injectable()
export class AudioIntelligenceService {
  build(script: ScriptPackage): AudioPlan {
    return {
      scenes: script.scenes.map((scene) => ({
        sceneOrder: scene.order,
        ambience: ['environment-bed', 'distance-layer', 'movement-layer'],
        effects: ['action-specific-effect', 'transition-accent'],
        dialogueTreatment: 'clean-dialogue-with-controlled-room-tone',
        silenceStrategy: scene.purpose === 'hook' ? 'micro-silence-before-impact' : 'story-motivated-silence',
      })),
      masteringRules: [
        'dialogue-first-mix',
        'platform-safe-loudness',
        'music-does-not-mask-dialogue',
        'consistent-room-tone',
        'no-clipping',
        'multilingual-version-level-matching',
      ],
    };
  }
}