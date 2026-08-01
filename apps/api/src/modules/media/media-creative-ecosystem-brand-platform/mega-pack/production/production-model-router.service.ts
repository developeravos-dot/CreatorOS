import { Injectable } from '@nestjs/common';
import { CreativeBrief, ProductionStyle } from '../media-mega.types';

@Injectable()
export class ProductionModelRouterService {
  route(brief: CreativeBrief, style: ProductionStyle) {
    const languageCount = Math.max(1, brief.languages?.length ?? 2);
    const premium = (brief.budget ?? 0) >= 10000;

    return {
      scriptModels: [
        'primary-screenwriting-model',
        'story-structure-reasoning-model',
        'dialogue-polish-model',
      ],
      reasoningModels: [
        'production-planning-model',
        'continuity-reasoning-model',
        'quality-critic-model',
      ],
      imageModels: [
        `${style}-concept-art-model`,
        'character-reference-model',
        'environment-reference-model',
      ],
      videoModels: [
        `${style}-video-generation-model`,
        'camera-control-model',
        'motion-consistency-model',
        ...(premium ? ['premium-restoration-model'] : []),
      ],
      voiceModels: [
        'multilingual-voice-model',
        'voice-identity-lock-model',
        ...(languageCount > 2 ? ['global-dubbing-model'] : []),
      ],
      musicModels: [
        'original-score-generation-model',
        'music-supervision-model',
        'rights-risk-checker',
      ],
      editingModels: [
        'edit-decision-model',
        'retention-analysis-model',
        'color-finishing-model',
        'audio-mastering-model',
      ],
      fallbackRoutes: {
        script: ['secondary-screenwriting-model', 'human-script-review'],
        image: ['secondary-image-model', 'manual-art-direction'],
        video: ['secondary-video-model', 'shot-redesign'],
        voice: ['secondary-voice-model', 'human-voice-review'],
        music: ['licensed-library-route', 'human-composer-route'],
      },
    };
  }
}