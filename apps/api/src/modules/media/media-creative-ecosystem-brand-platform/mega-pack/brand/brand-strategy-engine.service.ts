import { Injectable } from '@nestjs/common';
import { BrandBrief } from '../media-mega.types';

@Injectable()
export class BrandStrategyEngineService {
  build(brief: BrandBrief) {
    const name = brief.requestedName?.trim() || this.generateName(brief);
    const premium = `${brief.positioning ?? ''} ${brief.audience}`.toLowerCase().includes('premium');

    return {
      recommendedName: name,
      alternatives: [
        `${name} Originals`,
        `${name} Studio`,
        `${name} World`,
        `${name} Network`,
      ],
      purpose: `Build a recognizable global ${brief.contentType} brand.`,
      promise: `Original, trusted and high-quality ${brief.contentType} for ${brief.audience}.`,
      positioning: brief.positioning ?? `Global intelligent ${brief.contentType} brand`,
      personality: premium
        ? ['premium', 'confident', 'minimal', 'intelligent', 'global']
        : ['original', 'modern', 'clear', 'human', 'global'],
      values: ['originality', 'quality', 'trust', 'innovation', 'consistency'],
      differentiation: [
        'AI-native-brand-system',
        'multilingual-by-design',
        'global-local-adaptation',
        'connected-to-AVOS-media-ecosystem',
        'continuously-evolving-brand-intelligence',
      ],
      audiencePerceptionTarget: [
        'instantly-recognizable',
        'high-quality',
        'trustworthy',
        'future-ready',
      ],
    };
  }

  private generateName(brief: BrandBrief) {
    const token =
      brief.contentType
        .replace(/[^a-zA-Z0-9\u0600-\u06FF ]/g, '')
        .split(' ')
        .filter(Boolean)[0] ?? 'Media';

    return `AVOS ${token}`;
  }
}