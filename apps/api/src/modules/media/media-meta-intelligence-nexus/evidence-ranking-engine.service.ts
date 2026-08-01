import { Injectable } from '@nestjs/common';
import { EvidenceQuality, MetaIntelligenceInput } from './meta-intelligence.types';

@Injectable()
export class EvidenceRankingEngineService {
  rank(input: MetaIntelligenceInput) {
    const items = (input.signals ?? []).map((signal) => {
      const score = Number(
        Math.max(
          0,
          Math.min(
            1,
            signal.confidence * 0.45 +
              signal.recency * 0.25 +
              signal.relevance * 0.3,
          ),
        ).toFixed(3),
      );

      return {
        source: signal.source,
        statement: signal.statement,
        score,
        quality: this.quality(score),
      };
    });

    const aggregateScore =
      items.length === 0
        ? 0.5
        : Number(
            (
              items.reduce((sum, item) => sum + item.score, 0) /
              items.length
            ).toFixed(3),
          );

    return { items, aggregateScore };
  }

  private quality(score: number): EvidenceQuality {
    if (score >= 0.88) return 'verified';
    if (score >= 0.72) return 'strong';
    if (score >= 0.5) return 'moderate';
    return 'weak';
  }
}