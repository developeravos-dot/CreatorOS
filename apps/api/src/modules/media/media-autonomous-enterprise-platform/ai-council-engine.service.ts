import { Injectable } from '@nestjs/common';
import { AutonomousInitiativeInput } from './media-autonomous-enterprise.types';

@Injectable()
export class AiCouncilEngineService {
  deliberate(input: AutonomousInitiativeInput) {
    const strategicFit = this.n(input.strategicFit ?? 0.7);
    const readiness = this.n(input.readiness ?? 0.6);
    const expectedReturn = this.n(input.expectedReturn ?? 0.65);
    const complexity = this.n(input.complexity ?? 0.45);
    const risk = this.n(input.risk ?? 0.35);

    const confidence = Number(
      (
        strategicFit * 0.3 +
        readiness * 0.2 +
        expectedReturn * 0.25 +
        (1 - complexity) * 0.1 +
        (1 - risk) * 0.15
      ).toFixed(3),
    );

    return {
      recommendation:
        confidence >= 0.8
          ? ('prioritize' as const)
          : confidence >= 0.62
            ? ('approve-pilot' as const)
            : confidence >= 0.45
              ? ('observe' as const)
              : ('reject' as const),
      confidence,
      votes: [
        {
          agent: 'Strategy Agent',
          vote: strategicFit >= 0.65 ? 'support' : 'challenge',
          rationale: 'Strategic alignment and portfolio contribution',
        },
        {
          agent: 'Finance Agent',
          vote: expectedReturn >= 0.6 ? 'support' : 'challenge',
          rationale: 'Risk-adjusted value and capital efficiency',
        },
        {
          agent: 'Risk Agent',
          vote: risk <= 0.45 ? 'support' : 'challenge',
          rationale: 'Operational, legal and market exposure',
        },
        {
          agent: 'Execution Agent',
          vote: readiness >= 0.55 ? 'support' : 'challenge',
          rationale: 'Capability and delivery readiness',
        },
      ],
    };
  }

  private n(value: number) {
    return Math.max(0, Math.min(1, value));
  }
}