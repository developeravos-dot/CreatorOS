import { Injectable } from '@nestjs/common';
import { BrandIdentity, CreativeProjectInput } from './creative-brand-ecosystem.types';

@Injectable()
export class BrandIntelligencePlatformService {
  build(input: CreativeProjectInput): BrandIdentity {
    const brandName = this.generateName(input.name, input.contentType);
    return {
      brandName,
      positioning: `${input.contentType} brand built for ${input.audience} on ${input.platform}`,
      personality: ['distinctive', 'trusted', 'premium', 'recognizable', 'globally adaptable'],
      toneOfVoice: ['clear', 'confident', 'human', 'platform-native'],
      logoDirection: `scalable symbol and wordmark for ${brandName}`,
      bannerDirection: `channel promise, recognizable visual world, safe-area compliant composition`,
      profileImageDirection: `high-recognition compact brand mark for ${brandName}`,
      colorPalette: ['brand-primary', 'brand-secondary', 'brand-accent', 'neutral-light', 'neutral-dark'],
      typography: ['display-family', 'body-family', 'Arabic-compatible-family'],
      iconography: 'custom geometric icon system derived from the master brand DNA',
      thumbnailSystem: ['recognizable composition grid', 'subject hierarchy', 'controlled text area', 'series identifier', 'language-safe variants'],
      brandBookSections: ['strategy', 'purpose', 'audience', 'positioning', 'personality', 'voice', 'logo', 'colors', 'typography', 'imagery', 'motion', 'audio', 'templates', 'governance'],
      seasonalVariants: ['launch', 'campaign', 'Ramadan', 'Eid', 'year-end', 'special-event'],
    };
  }

  evolve(identity: BrandIdentity, growthScore: number): BrandIdentity {
    if (growthScore < 0.7) return identity;
    return {
      ...identity,
      personality: [...new Set([...identity.personality, 'category-leading'])],
      seasonalVariants: [...new Set([...identity.seasonalVariants, 'global-expansion'])],
    };
  }

  private generateName(name: string, contentType: string): string {
    const clean = name.trim();
    return clean.length > 1 ? clean : `AVOS ${contentType}`;
  }
}