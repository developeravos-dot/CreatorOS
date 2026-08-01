import { Injectable } from '@nestjs/common';
import { WorkflowStep } from './production-execution.contracts';

@Injectable()
export class QualityGateService {
  evaluate(step: WorkflowStep, minimumQuality: number): {
    passed: boolean;
    score: number;
    reason: string;
  } {
    const score = step.qualityScore ?? 0;
    const passed = score >= minimumQuality;

    return {
      passed,
      score,
      reason: passed
        ? `Quality gate passed with score ${score}.`
        : `Quality gate failed: score ${score}, required ${minimumQuality}.`,
    };
  }
}