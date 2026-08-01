import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  AnalyticsSnapshot,
  IntelligenceCoreBrief,
} from '../intelligence-core.types';

@Injectable()
export class MediaAnalyticsIntelligenceService {
  createBaseline(brief: IntelligenceCoreBrief): AnalyticsSnapshot {
    const metrics = Object.fromEntries(
      (brief.metrics ?? [
        'reach',
        'retention',
        'engagement',
        'conversion',
        'quality',
        'revenue',
      ]).map((metric) => [metric, 0]),
    );

    return {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      metrics,
      healthScore: 75,
      anomalies: [],
      insights: [
        'Baseline established.',
        'More production data is required before strong conclusions.',
      ],
      recommendations: [
        'collect-consistent-metrics',
        'preserve-source-attribution',
        'validate-data-quality',
      ],
    };
  }

  analyze(
    previous: AnalyticsSnapshot,
    updates: Record<string, number>,
  ): AnalyticsSnapshot {
    const metrics = {
      ...previous.metrics,
      ...updates,
    };

    const values = Object.values(metrics);
    const normalized = values.map((value) =>
      Math.max(0, Math.min(100, value)),
    );
    const healthScore =
      normalized.length === 0
        ? 0
        : Math.round(
            normalized.reduce((sum, value) => sum + value, 0) /
              normalized.length,
          );

    const anomalies = Object.entries(metrics)
      .filter(([, value]) => value < 0 || value > 100)
      .map(([name]) => `${name}-outside-expected-range`);

    const insights = Object.entries(updates).map(
      ([name, value]) => `${name} updated to ${value}`,
    );

    return {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      metrics,
      healthScore,
      anomalies,
      insights,
      recommendations:
        healthScore < 60
          ? ['investigate-low-performing-metrics', 'pause-risky-automation']
          : ['continue-measured-optimization', 'retain-validated-learnings'],
    };
  }
}