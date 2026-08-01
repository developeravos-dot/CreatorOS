import { Injectable } from '@nestjs/common';
import { IntelligenceSignalInput } from './media-intelligence-cloud.types';

@Injectable()
export class PortfolioOptimizationEngineService {
  score(input: IntelligenceSignalInput) {
    return {
      strategicContribution: Number(
        Math.max(0, Math.min(1, input.strategicFit ?? 0.75)).toFixed(3),
      ),
      diversificationContribution: Number(
        Math.max(
          0,
          Math.min(
            1,
            ((input.novelty ?? 0.65) + (input.impact ?? 0.7)) / 2,
          ),
        ).toFixed(3),
      ),
      capitalEfficiency: Number(
        Math.max(
          0,
          Math.min(
            1,
            ((input.executionReadiness ?? 0.6) +
              (1 - (input.risk ?? 0.35))) /
              2,
          ),
        ).toFixed(3),
      ),
    };
  }
}