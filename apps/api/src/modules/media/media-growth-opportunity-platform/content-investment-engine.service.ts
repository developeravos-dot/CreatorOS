import { Injectable } from '@nestjs/common';
import {
  ContentInvestmentCase,
  OpportunitySignalInput,
  OpportunityScore,
} from './media-growth-opportunity.types';

@Injectable()
export class ContentInvestmentEngineService {
  build(
    input: OpportunitySignalInput,
    score: OpportunityScore,
  ): ContentInvestmentCase {
    return {
      thesis: `${input.title} can create strategic and commercial advantage through a controlled evidence-based experiment.`,
      expectedBenefits: [
        'new-audience-acquisition',
        'content-IP-expansion',
        'revenue-diversification',
        'cross-platform-distribution',
        'learning-compounding',
      ],
      requiredCapabilities: [
        'creative-production',
        'audience-intelligence',
        'distribution-intelligence',
        'brand-governance',
        'measurement',
        'human-final-authority',
      ],
      experimentPlan: [
        'define-one-testable-hypothesis',
        'produce-minimum-viable-format',
        'launch-controlled-pilot',
        'measure-retention-and-demand',
        'compare-against-baseline',
        'submit-scale-decision-for-human-approval',
      ],
      scalePlan: [
        'repeat-winning-format',
        'expand-language-coverage',
        'expand-market-coverage',
        'build-recurring-series',
        'activate-commercial-models',
        'convert-winner-into-owned-IP',
      ],
      stopConditions: [
        'brand-safety-failure',
        'rights-conflict',
        'negative-unit-economics',
        'retention-below-threshold',
        'human-rejection',
      ],
      investmentReadiness: score.total,
    };
  }
}