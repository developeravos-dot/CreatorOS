import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MetaIntelligenceInput } from './meta-intelligence.types';

@Injectable()
export class OpportunityGraphEngineService {
  build(input: MetaIntelligenceInput) {
    const fit = input.strategicFit ?? 0.75;
    const readiness = input.readiness ?? 0.6;
    const expectedReturn = input.expectedReturn ?? 0.65;

    return {
      opportunities: [
        {
          id: randomUUID(),
          title: `Scale ${input.domain} capability`,
          score: this.score(fit, readiness, expectedReturn),
          dependencies: ['human-approval', 'validated-demand'],
        },
        {
          id: randomUUID(),
          title: `Create reusable ${input.domain} platform asset`,
          score: this.score(fit, readiness * 0.9, expectedReturn * 0.85),
          dependencies: ['architecture-review', 'capability-owner'],
        },
        {
          id: randomUUID(),
          title: `Build partner ecosystem for ${input.domain}`,
          score: this.score(fit * 0.9, readiness * 0.8, expectedReturn * 0.95),
          dependencies: ['partner-selection', 'commercial-model'],
        },
      ].sort((a, b) => b.score - a.score),
    };
  }

  private score(a: number, b: number, c: number) {
    return Number(Math.max(0, Math.min(1, a * 0.4 + b * 0.25 + c * 0.35)).toFixed(3));
  }
}