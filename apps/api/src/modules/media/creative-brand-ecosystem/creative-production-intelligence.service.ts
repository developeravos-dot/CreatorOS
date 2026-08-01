import { Injectable } from '@nestjs/common';
import { CreativeProjectInput, ProductionBlueprint, ProductionStyle } from './creative-brand-ecosystem.types';

@Injectable()
export class CreativeProductionIntelligenceService {
  build(input: CreativeProjectInput): ProductionBlueprint {
    const style = this.selectStyle(input);
    return {
      style,
      aiModelRouting: {
        research: 'reasoning-model',
        script: 'long-form-language-model',
        storyboard: 'image-generation-model',
        video: style === 'animation' || style === 'anime' ? 'animation-video-model' : 'cinematic-video-model',
        voice: 'multilingual-voice-model',
        music: 'licensed-generative-music-model',
        quality: 'multimodal-quality-model',
      },
      colors: this.palette(style, input.ageGroup),
      characters: ['lead-character', 'supporting-character', 'narrator-avatar'],
      voices: this.voices(input.languages ?? ['Arabic']),
      music: style === 'cinematic' ? 'orchestral cinematic score' : 'adaptive branded score',
      camera: ['establishing shot', 'motivated movement', 'close-up emphasis', 'platform-safe framing'],
      lighting: style === 'realistic' ? 'natural motivated lighting' : 'controlled stylized lighting',
      editing: ['hook-first opening', 'rhythm control', 'continuity validation', 'platform-native pacing'],
      productionCouncil: ['AI Director', 'AI Screenwriter', 'AI Art Director', 'AI Cinematographer', 'AI Sound Director', 'AI Editor', 'AI Quality Lead'],
      qualityGates: ['originality', 'brand consistency', 'visual continuity', 'audio continuity', 'cultural safety', 'age suitability', 'technical compliance'],
      localizationRules: (input.languages ?? ['Arabic']).map((language) => `${language}: native adaptation, not literal translation`),
    };
  }

  learn(blueprint: ProductionBlueprint, signal: string, value: number) {
    return {
      signal,
      value,
      action: value >= 0.75 ? `preserve-${blueprint.style}-production-pattern` : `re-optimize-${blueprint.style}-production-pattern`,
    };
  }

  private selectStyle(input: CreativeProjectInput): ProductionStyle {
    const text = `${input.contentType} ${input.audience} ${input.ageGroup}`.toLowerCase();
    if (text.includes('children') || text.includes('kids') || text.includes('طفل')) return 'animation';
    if (text.includes('anime') || text.includes('أنمي')) return 'anime';
    if (text.includes('documentary') || text.includes('وثائقي')) return 'realistic';
    if (text.includes('story') || text.includes('cinema') || text.includes('قصة')) return 'cinematic';
    return 'hybrid';
  }

  private palette(style: ProductionStyle, ageGroup: string): string[] {
    if (/child|kid|طفل/i.test(ageGroup)) return ['vivid-primary', 'friendly-secondary', 'high-contrast-accent'];
    if (style === 'cinematic') return ['deep-neutral', 'premium-gold', 'controlled-accent'];
    return ['brand-primary', 'brand-secondary', 'attention-accent'];
  }

  private voices(languages: string[]): string[] {
    return languages.map((language) => `${language}-native-premium-voice`);
  }
}