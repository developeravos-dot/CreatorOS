import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  AnalyticsSnapshot,
  ImprovementProposal,
  LearningRecord,
} from '../intelligence-core.types';

@Injectable()
export class AutonomousImprovementIntelligenceService {
  propose(
    analytics: AnalyticsSnapshot,
    learnings: LearningRecord[],
  ): ImprovementProposal[] {
    const proposals: ImprovementProposal[] = [];

    if (analytics.healthScore < 70) {
      proposals.push({
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        title: 'Improve Low-Health Metrics',
        problem: `System health score is ${analytics.healthScore}.`,
        proposedChange:
          'Run controlled experiments on the weakest metrics while preserving rollback.',
        expectedImpact: 'Higher overall health and fewer weak performance areas.',
        riskScore: 0.35,
        reversible: true,
        status: 'awaiting-human-approval',
      });
    }

    const validatedCandidates = learnings.filter(
      (learning) => learning.confidence >= 0.8,
    );

    for (const learning of validatedCandidates) {
      proposals.push({
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        title: 'Test High-Confidence Learning',
        problem: 'A potentially reusable learning is not yet operationalized.',
        proposedChange: learning.reusableRule,
        expectedImpact: 'Convert validated learning into measurable improvement.',
        riskScore: 0.25,
        reversible: true,
        status: 'awaiting-human-approval',
      });
    }

    if (proposals.length === 0) {
      proposals.push({
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        title: 'Maintain and Observe',
        problem: 'No critical weakness currently requires change.',
        proposedChange:
          'Continue observation and collect more evidence before mutation.',
        expectedImpact: 'Avoid unnecessary optimization and preserve stability.',
        riskScore: 0.05,
        reversible: true,
        status: 'awaiting-human-approval',
      });
    }

    return proposals;
  }
}