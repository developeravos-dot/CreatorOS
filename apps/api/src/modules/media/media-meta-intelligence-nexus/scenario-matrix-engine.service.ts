import { Injectable } from '@nestjs/common';
import { MetaIntelligenceInput, NexusScenario } from './meta-intelligence.types';

@Injectable()
export class ScenarioMatrixEngineService {
  simulate(input: MetaIntelligenceInput): NexusScenario[] {
    const fit = input.strategicFit ?? 0.75;
    const readiness = input.readiness ?? 0.6;
    const risk = input.risk ?? 0.35;
    const expectedReturn = input.expectedReturn ?? 0.65;

    return [
      this.build('defensive', 0.25, fit * 0.65, expectedReturn * 0.55, risk * 0.75),
      this.build('balanced', 0.4, fit * 0.85, expectedReturn * 0.85, risk),
      this.build('offensive', 0.25, fit, expectedReturn * 1.15, risk * 1.1),
      this.build('transformational', 0.1, fit * readiness * 1.1, expectedReturn * 1.45, risk * 1.25),
    ];
  }

  private build(
    name: NexusScenario['name'],
    probability: number,
    outcome: number,
    value: number,
    risk: number,
  ): NexusScenario {
    const outcomeScore = this.n(outcome);
    const valueScore = this.n(value);
    const riskScore = this.n(risk);

    return {
      name,
      probability,
      outcomeScore,
      valueScore,
      riskScore,
      recommendation:
        outcomeScore * 0.45 + valueScore * 0.4 - riskScore * 0.3 >= 0.5
          ? 'proceed-with-gates'
          : 'redesign-and-retest',
    };
  }

  private n(value: number) {
    return Number(Math.max(0, Math.min(1, value)).toFixed(3));
  }
}