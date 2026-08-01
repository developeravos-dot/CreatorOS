import { Injectable } from '@nestjs/common';
import { CreativeBrief, ProductionStyle } from '../media-mega.types';

@Injectable()
export class ProductionIntelligenceAnalyzerService {
  analyze(brief: CreativeBrief) {
    const text = [
      brief.contentType,
      brief.audience,
      brief.ageGroup,
      brief.platform,
      brief.objective ?? '',
      brief.tone ?? '',
    ].join(' ').toLowerCase();

    const style = this.selectStyle(text);
    const duration = Math.max(15, brief.durationSeconds ?? 180);

    return {
      audienceProfile: {
        audience: brief.audience,
        ageGroup: brief.ageGroup,
        expectedAttentionSpanSeconds: this.attentionSpan(brief.platform, duration),
        emotionalDrivers: this.emotionalDrivers(text),
        accessibilityNeeds: ['clear-dialogue', 'readable-subtitles', 'visual-focus'],
      },
      platformProfile: {
        platform: brief.platform,
        orientation: this.orientation(brief.platform),
        pacing: this.pacing(brief.platform),
        hookWindowSeconds: this.hookWindow(brief.platform),
        safeDurationSeconds: duration,
      },
      culturalProfile: {
        languages: brief.languages ?? ['Arabic', 'English'],
        cultures: brief.cultures ?? [],
        rules: [
          'preserve-core-meaning',
          'validate-symbols',
          'adapt-humor',
          'adapt-voice-performance',
          'avoid-literal-only-localization',
        ],
      },
      riskProfile: [
        'copyright-risk',
        'character-consistency-risk',
        'cultural-context-risk',
        'model-output-variance',
        'platform-policy-risk',
      ],
      selectedStyle: style,
      styleRationale: this.rationale(style, text),
    };
  }

  private selectStyle(text: string): ProductionStyle {
    if (text.includes('anime')) return 'anime';
    if (text.includes('children') || text.includes('kids')) return 'animation';
    if (text.includes('documentary') || text.includes('history')) return 'hybrid';
    if (text.includes('real') || text.includes('interview')) return 'realistic';
    return 'cinematic';
  }

  private rationale(style: ProductionStyle, text: string) {
    const base = ['audience-fit', 'platform-fit', 'brand-building', 'production-control'];
    if (style === 'animation') base.push('age-appropriate-visual-control');
    if (style === 'anime') base.push('genre-expectation');
    if (style === 'hybrid') base.push('evidence-plus-reconstruction');
    if (text.includes('short') || text.includes('tiktok') || text.includes('reels')) {
      base.push('retention-optimized');
    }
    return base;
  }

  private attentionSpan(platform: string, duration: number) {
    const value = platform.toLowerCase();
    if (value.includes('tiktok') || value.includes('reels')) return Math.min(8, duration);
    if (value.includes('short')) return Math.min(10, duration);
    return Math.min(30, duration);
  }

  private orientation(platform: string) {
    const value = platform.toLowerCase();
    return value.includes('tiktok') || value.includes('reels') || value.includes('short')
      ? 'vertical-9:16'
      : 'landscape-16:9';
  }

  private pacing(platform: string) {
    const value = platform.toLowerCase();
    return value.includes('tiktok') || value.includes('reels') ? 'fast' : 'story-driven';
  }

  private hookWindow(platform: string) {
    const value = platform.toLowerCase();
    return value.includes('tiktok') || value.includes('reels') ? 2 : 8;
  }

  private emotionalDrivers(text: string) {
    const drivers = ['curiosity', 'clarity', 'progress'];
    if (text.includes('mystery')) drivers.push('suspense');
    if (text.includes('children')) drivers.push('wonder', 'safety');
    if (text.includes('technology')) drivers.push('future-possibility');
    return drivers;
  }
}