import { Injectable } from '@nestjs/common';
import {
  CreativeMode,
  CreativeProjectBrief,
  VisualStyleProfile,
} from '../creative-intelligence.types';

@Injectable()
export class VisualStyleIntelligenceService {
  build(brief: CreativeProjectBrief): VisualStyleProfile {
    const mode = this.modeFor(brief);
    const premium = `${brief.tone ?? ''} ${brief.audience}`.toLowerCase().includes('premium');

    return {
      mode,
      visualPrinciples: [
        'story-first-composition',
        'recognizable-subject-focus',
        'controlled-depth',
        'consistent-character-identity',
        'consistent-world-language',
        'platform-safe-framing',
      ],
      palette: premium
        ? [
            { name: 'Midnight Navy', hex: '#0A192F', usage: 'depth-and-authority' },
            { name: 'Royal Gold', hex: '#D4AF37', usage: 'premium-accent' },
            { name: 'Ivory', hex: '#F8F4E3', usage: 'clarity-and-balance' },
            { name: 'Deep Black', hex: '#111111', usage: 'contrast' },
          ]
        : [
            { name: 'Deep Slate', hex: '#0F172A', usage: 'primary-background' },
            { name: 'Electric Blue', hex: '#2563EB', usage: 'intelligence-accent' },
            { name: 'Cyan', hex: '#06B6D4', usage: 'secondary-energy' },
            { name: 'Cloud White', hex: '#F8FAFC', usage: 'clarity' },
          ],
      textureLanguage: [
        `${mode}-surface-language`,
        'controlled-material-detail',
        'no-random-texture-shifts',
      ],
      compositionRules: [
        'one-primary-subject',
        'clear-eye-path',
        'depth-separated-layers',
        'reserve-space-for-subtitles',
        'mobile-legibility',
      ],
      forbiddenVisuals: [
        'identity-drift',
        'extra-limbs',
        'watermarks',
        'unreadable-text',
        'copyrighted-character-imitation',
        'inconsistent-costume',
      ],
    };
  }

  private modeFor(brief: CreativeProjectBrief): CreativeMode {
    const text = `${brief.contentType} ${brief.genre ?? ''} ${brief.tone ?? ''}`.toLowerCase();

    if (text.includes('anime')) return 'anime';
    if (text.includes('animation') || text.includes('children')) return 'animation';
    if (text.includes('documentary')) return 'documentary';
    if (text.includes('realistic') || text.includes('interview')) return 'realistic';
    if (text.includes('hybrid')) return 'hybrid';
    return 'cinematic';
  }
}