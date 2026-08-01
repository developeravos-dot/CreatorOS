import { Injectable } from '@nestjs/common';
import {
  AudienceDistributionProgram,
  ContentQualityReview,
} from '../audience-distribution.types';

@Injectable()
export class ContentQualityIntelligenceService {
  evaluate(program: AudienceDistributionProgram): ContentQualityReview {
    const scores = {
      trendRelevance: program.trends.length >= 1 ? 92 : 50,
      audienceClarity: program.audienceSegments.length >= 3 ? 95 : 60,
      publishingCoverage: program.publishing.platforms.length >= 1 ? 93 : 55,
      localizationReadiness: program.localization.targets.length >= 1 ? 94 : 55,
      culturalReadiness: program.culturalReview.markets.length >= 1 ? 92 : 50,
      metadataReadiness: program.publishing.platforms.every(
        (item) => item.metadataStrategy.length > 0,
      )
        ? 91
        : 60,
      experimentReadiness: program.publishing.experiments.length >= 4 ? 90 : 65,
      governance: program.governance.humanApproved ? 100 : 70,
    };

    const failures = Object.entries(scores)
      .filter(([, score]) => score < 80)
      .map(([name]) => `${name}-below-threshold`);

    return {
      scores,
      failures,
      approved: failures.length === 0 && program.governance.humanApproved,
    };
  }
}