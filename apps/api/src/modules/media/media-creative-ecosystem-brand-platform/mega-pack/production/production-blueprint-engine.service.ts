import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreativeBrief, ProductionScene, ProductionStyle } from '../media-mega.types';

@Injectable()
export class ProductionBlueprintEngineService {
  buildScenes(brief: CreativeBrief, style: ProductionStyle): ProductionScene[] {
    const total = Math.max(15, brief.durationSeconds ?? 180);
    const count = Math.max(5, Math.min(30, Math.ceil(total / 18)));
    const base = Math.floor(total / count);
    const remainder = total - base * count;

    return Array.from({ length: count }, (_, index) => {
      const first = index === 0;
      const last = index === count - 1;
      const durationSeconds = base + (index < remainder ? 1 : 0);

      return {
        id: randomUUID(),
        order: index + 1,
        purpose: first ? 'hook' : last ? 'resolution-and-next-action' : 'story-development',
        durationSeconds,
        script: `${brief.title} scene ${index + 1}: ${first ? 'immediate compelling hook' : last ? 'meaningful resolution' : 'advance the central narrative'}.`,
        visualPrompt: `${style}, premium global studio quality, scene ${index + 1}, coherent characters, coherent environment, platform ${brief.platform}`,
        negativePrompt: [
          'identity-drift',
          'extra-limbs',
          'inconsistent-costume',
          'unreadable-text',
          'watermark',
          'copyrighted-character-imitation',
        ],
        camera: {
          shot: first ? 'hero-close-or-wide-reveal' : 'story-motivated-shot',
          lens: first ? '24mm-or-50mm' : '35mm',
          movement: first ? 'dynamic-controlled-push' : 'motivated-controlled-movement',
          framing: brief.platform.toLowerCase().includes('tiktok')
            ? 'vertical-safe-framing'
            : 'cinematic-safe-framing',
        },
        lighting: {
          setup: 'motivated-three-point-or-naturalistic-light',
          mood: first ? 'high-impact' : 'narrative-consistent',
          colorTemperature: index % 2 === 0 ? 'balanced-warm' : 'balanced-cool',
        },
        sound: {
          dialogue: first ? 'hook-line' : 'scene-specific-dialogue',
          ambience: ['environment-bed', 'depth-layer'],
          effects: ['transition-accent', 'action-specific-effect'],
          musicCue: first ? 'signature-opening-theme' : 'adaptive-story-score',
        },
        continuity: {
          characters: ['approved-character-bible'],
          wardrobe: ['approved-wardrobe-state'],
          props: ['approved-prop-state'],
          environment: 'approved-world-bible-location',
        },
        status: 'planned',
      };
    });
  }

  buildCharacterBible(brief: CreativeBrief) {
    return [
      {
        name: 'Primary Character',
        role: 'story-anchor',
        appearance: ['locked-face-ratios', 'locked-hair', 'locked-body-proportions'],
        personality: ['clear-motivation', 'consistent-behavior', 'audience-appropriate'],
        voiceProfile: `${brief.tone ?? 'professional'} multilingual identity`,
        continuityFingerprint: `CHAR-${randomUUID()}`,
      },
    ];
  }

  buildWorldBible(style: ProductionStyle) {
    return {
      locations: ['primary-world', 'secondary-world', 'transition-space'],
      geographyRules: ['fixed-location-map', 'fixed-direction-logic', 'fixed-scale'],
      architectureRules: [`${style}-architecture-language`, 'repeatable-material-system'],
      colorRules: ['primary-palette', 'secondary-palette', 'narrative-accent-color'],
      lightingRules: ['time-of-day-continuity', 'motivated-light', 'scene-mood-control'],
    };
  }
}