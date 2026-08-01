import { Injectable } from '@nestjs/common';
import {
  ContentSafetyReview,
  DistributionBrief,
} from '../audience-distribution.types';

@Injectable()
export class ContentSafetyIntelligenceService {
  review(brief: DistributionBrief): ContentSafetyReview {
    const text = `${brief.title} ${brief.topic} ${brief.contentType}`.toLowerCase();
    const flags: string[] = [];

    if (text.includes('children') || brief.ageGroup.includes('child')) {
      flags.push('child-safety-review-required');
    }

    if (text.includes('medical') || text.includes('health')) {
      flags.push('medical-claims-review-required');
    }

    if (text.includes('finance') || text.includes('investment')) {
      flags.push('financial-claims-review-required');
    }

    if (text.includes('politic')) {
      flags.push('political-context-review-required');
    }

    const riskScore = Math.min(
      1,
      (brief.riskTolerance ?? 0.25) + flags.length * 0.12,
    );

    const requiredActions = [
      'platform-policy-review',
      'copyright-and-rights-review',
      'age-rating-review',
      'claims-verification',
      'human-final-approval',
    ];

    if (flags.length > 0) {
      requiredActions.push('specialist-review-for-flagged-content');
    }

    return {
      riskScore,
      flags,
      requiredActions,
      safeForDistribution: riskScore < 0.75,
    };
  }
}