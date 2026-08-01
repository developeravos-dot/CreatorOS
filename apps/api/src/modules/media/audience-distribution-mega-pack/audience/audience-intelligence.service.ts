import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  AudienceSegment,
  DistributionBrief,
} from '../audience-distribution.types';

@Injectable()
export class AudienceIntelligenceService {
  segment(brief: DistributionBrief): AudienceSegment[] {
    return [
      {
        id: randomUUID(),
        name: 'Core Audience',
        description: brief.audience,
        needs: ['clarity', 'relevance', 'originality', 'trust'],
        motivations: ['discovery', 'learning', 'entertainment', 'identity'],
        barriers: ['weak-hook', 'slow-pacing', 'low-trust', 'repetition'],
        preferredFormats: this.formatsFor(brief),
        retentionTriggers: [
          'strong-opening-promise',
          'progressive-revelation',
          'emotional-payoff',
          'clear-next-step',
        ],
      },
      {
        id: randomUUID(),
        name: 'Growth Audience',
        description: `Adjacent audience interested in ${brief.topic}`,
        needs: ['accessible-context', 'strong-visuals', 'social-proof'],
        motivations: ['curiosity', 'shareability', 'status', 'utility'],
        barriers: ['too-technical', 'unclear-value', 'weak-localization'],
        preferredFormats: ['short-form', 'explainer', 'story-driven-video'],
        retentionTriggers: [
          'fast-context',
          'surprising-fact',
          'clear-comparison',
          'memorable-summary',
        ],
      },
      {
        id: randomUUID(),
        name: 'Premium Audience',
        description: `High-intent audience seeking depth and authority in ${brief.topic}`,
        needs: ['depth', 'credibility', 'quality', 'exclusive-value'],
        motivations: ['mastery', 'investment', 'leadership', 'premium-experience'],
        barriers: ['generic-content', 'weak-evidence', 'low-production-quality'],
        preferredFormats: ['documentary', 'long-form', 'report', 'premium-series'],
        retentionTriggers: [
          'expert-framing',
          'evidence',
          'high-production-value',
          'strategic-insight',
        ],
      },
    ];
  }

  private formatsFor(brief: DistributionBrief) {
    const platforms = brief.platforms ?? ['YouTube'];

    return platforms.map((platform) =>
      platform.toLowerCase().includes('tiktok') ||
      platform.toLowerCase().includes('short')
        ? 'vertical-short-form'
        : 'landscape-long-form',
    );
  }
}