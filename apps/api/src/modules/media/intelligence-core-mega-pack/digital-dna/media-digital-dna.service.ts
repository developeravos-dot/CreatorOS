import { Injectable } from '@nestjs/common';
import {
  DigitalDnaProfile,
  IntelligenceCoreBrief,
} from '../intelligence-core.types';

@Injectable()
export class MediaDigitalDnaService {
  build(brief: IntelligenceCoreBrief): DigitalDnaProfile {
    return {
      identity: {
        projectId: brief.projectId,
        title: brief.title,
        domain: brief.domain,
      },
      principles: [
        'foundation-first',
        'capability-first',
        'blueprint-driven',
        'human-final-authority',
        ...(brief.protectedPrinciples ?? []),
      ],
      creativePatterns: [
        'original-content-first',
        'story-before-tools',
        'consistent-identity',
        'premium-quality',
      ],
      audiencePatterns: [
        'audience-value-first',
        'cultural-awareness',
        'localized-without-identity-loss',
        'trust-preservation',
      ],
      businessPatterns: [
        'diversified-revenue',
        'protect-ip-ownership',
        'measured-growth',
        'partnership-fit-before-scale',
      ],
      qualityPatterns: [
        'quality-gates',
        'safety-gates',
        'evidence-before-learning',
        'rollback-ready',
      ],
      decisionPatterns: [
        'human-approval-for-strategic-change',
        'autonomous-proposal-not-autonomous-authority',
        'audit-all-major-decisions',
      ],
      forbiddenMutations: [
        'remove-human-final-authority',
        'erase-audit-history',
        'override-protected-principles',
        'apply-unvalidated-strategic-change',
      ],
      version: '1.0.0',
    };
  }
}