import { Injectable } from '@nestjs/common';
import { MetaIntelligenceInput } from './meta-intelligence.types';

@Injectable()
export class CapabilityEvolutionEngineService {
  evaluate(input: MetaIntelligenceInput) {
    const existing = input.capabilities ?? [];
    const target = [
      'research',
      'knowledge-graph',
      'scenario-simulation',
      'portfolio-intelligence',
      'agent-orchestration',
      'observability',
      'learning',
    ];

    const missing = target.filter((capability) => !existing.includes(capability));

    return {
      existing,
      missing,
      recommended: missing.map((capability) => `build:${capability}`),
      maturityScore: Number((existing.length / target.length).toFixed(3)),
    };
  }
}