import { Injectable } from '@nestjs/common';
import { BrandBrief } from '../media-mega.types';

@Injectable()
export class BrandIdentityEngineService {
  build(brief: BrandBrief, brandName: string) {
    const text = `${brief.contentType} ${brief.audience} ${brief.positioning ?? ''}`.toLowerCase();
    const kids = text.includes('kids') || text.includes('children');
    const premium = text.includes('premium') || text.includes('luxury');

    const palette = kids
      ? [
          { name: 'Joy Red', hex: '#FF6B6B', usage: 'energy-and-focus' },
          { name: 'Sun Yellow', hex: '#FFD93D', usage: 'optimism' },
          { name: 'Growth Green', hex: '#6BCB77', usage: 'positive-progress' },
          { name: 'Sky Blue', hex: '#4D96FF', usage: 'trust-and-depth' },
        ]
      : premium
        ? [
            { name: 'Midnight Navy', hex: '#0A192F', usage: 'primary-background' },
            { name: 'Royal Gold', hex: '#D4AF37', usage: 'premium-accent' },
            { name: 'Ivory', hex: '#F8F4E3', usage: 'light-background' },
            { name: 'Deep Black', hex: '#111111', usage: 'contrast' },
          ]
        : [
            { name: 'Deep Slate', hex: '#0F172A', usage: 'primary-background' },
            { name: 'Electric Blue', hex: '#2563EB', usage: 'primary-accent' },
            { name: 'Intelligence Cyan', hex: '#06B6D4', usage: 'secondary-accent' },
            { name: 'Cloud White', hex: '#F8FAFC', usage: 'light-background' },
          ];

    return {
      logoSystem: [
        'primary-symbol-plus-wordmark',
        'horizontal-lockup',
        'vertical-lockup',
        'symbol-only',
        'monochrome',
        'small-size-version',
        'motion-logo',
      ],
      symbolDirection: `${brandName} distinctive scalable symbol connected to AVOS parent identity`,
      wordmarkDirection: 'custom-modern-multilingual-wordmark',
      profileImageDirection: 'high-recognition-symbol-only-avatar',
      bannerDirection: `cinematic platform-safe banner for ${brief.platform}`,
      palette,
      typography: [
        { role: 'display', direction: 'premium-modern-display-type' },
        { role: 'body', direction: 'high-legibility-multilingual-sans' },
        { role: 'arabic', direction: 'modern-arabic-compatible-family' },
        { role: 'numbers', direction: 'tabular-data-friendly-numerals' },
      ],
      iconography: [
        'geometric',
        'consistent-stroke',
        'rounded-or-premium-sharp-by-brand',
        'multilingual-safe-symbols',
      ],
      imagery: [
        'controlled-color-grading',
        'recognizable-subject-focus',
        'original-assets-only',
        'consistent-depth-and-lighting',
      ],
      motionIdentity: [
        'signature-logo-reveal',
        'fixed-transition-language',
        'brand-motion-curves',
        'platform-speed-variants',
      ],
      soundIdentity: [
        'signature-sonic-logo',
        'opening-audio-motif',
        'transition-sound-family',
        'campaign-audio-variants',
      ],
    };
  }
}