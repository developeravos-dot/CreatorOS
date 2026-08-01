import { Injectable } from '@nestjs/common';
import { MetaIntelligenceInput } from './meta-intelligence.types';

@Injectable()
export class WorldModelEngineService {
  build(input: MetaIntelligenceInput) {
    return {
      currentState: {
        strategicFit: this.n(input.strategicFit ?? 0.75),
        urgency: this.n(input.urgency ?? 0.6),
        readiness: this.n(input.readiness ?? 0.6),
        complexity: this.n(input.complexity ?? 0.45),
        risk: this.n(input.risk ?? 0.35),
      },
      externalForces: [
        'market-demand',
        'platform-policy',
        'technology-change',
        'competitor-movement',
        'audience-behavior',
        'regulation',
      ],
      assumptions: [
        'signals-are-current-enough',
        'execution-capability-can-be-expanded',
        'human-approval-remains-final',
      ],
    };
  }

  private n(value: number) {
    return Math.max(0, Math.min(1, value));
  }
}