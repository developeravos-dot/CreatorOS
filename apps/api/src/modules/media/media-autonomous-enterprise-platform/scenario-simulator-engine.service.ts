import { Injectable } from '@nestjs/common';
import {
  AutonomousInitiativeInput,
  ScenarioResult,
} from './media-autonomous-enterprise.types';

@Injectable()
export class ScenarioSimulatorEngineService {
  simulate(input: AutonomousInitiativeInput): ScenarioResult[] {
    const budget = input.budget ?? 100000;
    const expectedReturn = input.expectedReturn ?? 0.65;
    const risk = input.risk ?? 0.35;

    return [
      this.build(
        'conservative',
        0.3,
        budget,
        expectedReturn * 0.55,
        Math.min(1, risk + 0.15),
      ),
      this.build(
        'base',
        0.5,
        budget,
        expectedReturn,
        risk,
      ),
      this.build(
        'accelerated',
        0.2,
        budget,
        expectedReturn * 1.45,
        Math.max(0, risk - 0.05),
      ),
    ];
  }

  private build(
    name: string,
    probability: number,
    budget: number,
    returnRate: number,
    risk: number,
  ): ScenarioResult {
    const expectedValue = Math.round(budget * (1 + returnRate));
    const riskAdjustedValue = Math.round(expectedValue * (1 - risk));

    return {
      name,
      probability,
      expectedValue,
      riskAdjustedValue,
      assumptions: [
        'market-demand-remains-within-range',
        'execution-capacity-is-available',
        'rights-and-compliance-gates-pass',
      ],
      recommendation:
        riskAdjustedValue > budget
          ? 'proceed-with-controlled-gates'
          : 'redesign-before-execution',
    };
  }
}