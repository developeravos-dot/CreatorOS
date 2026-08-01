import { Injectable } from '@nestjs/common';
import { MetaIntelligenceInput } from './meta-intelligence.types';

@Injectable()
export class DigitalOrganizationBrainService {
  build(input: MetaIntelligenceInput) {
    const risk = input.risk ?? 0.35;
    const readiness = input.readiness ?? 0.6;

    return {
      executiveCouncil: [
        {
          agent: 'Strategy Executive Agent',
          role: 'strategic-fit',
          vote: (input.strategicFit ?? 0.75) >= 0.65 ? 'support' as const : 'challenge' as const,
          rationale: 'Portfolio and long-term strategic contribution',
        },
        {
          agent: 'Finance Executive Agent',
          role: 'capital-allocation',
          vote: (input.expectedReturn ?? 0.65) >= 0.55 ? 'support' as const : 'challenge' as const,
          rationale: 'Expected value and capital efficiency',
        },
        {
          agent: 'Risk Executive Agent',
          role: 'risk-control',
          vote: risk <= 0.45 ? 'support' as const : 'challenge' as const,
          rationale: 'Risk exposure and mitigation readiness',
        },
        {
          agent: 'Operations Executive Agent',
          role: 'execution-readiness',
          vote: readiness >= 0.55 ? 'support' as const : 'challenge' as const,
          rationale: 'Delivery feasibility and resource readiness',
        },
      ],
      teams: [
        {
          name: 'Research Team',
          agents: ['Research Agent', 'Evidence Agent', 'Trend Agent'],
          mission: 'Collect and validate intelligence',
        },
        {
          name: 'Strategy Team',
          agents: ['Strategy Agent', 'Scenario Agent', 'Portfolio Agent'],
          mission: 'Convert intelligence into governed decisions',
        },
        {
          name: 'Execution Team',
          agents: ['Planning Agent', 'Operations Agent', 'Observability Agent'],
          mission: 'Deliver approved plans and capture learning',
        },
      ],
    };
  }
}