import { Injectable } from '@nestjs/common';
import { IntelligenceSignalInput } from './media-intelligence-cloud.types';

@Injectable()
export class PredictiveIntelligenceEngineService {
  forecast(input: IntelligenceSignalInput) {
    const probability = Math.max(
      0,
      Math.min(
        1,
        (input.confidence ?? 0.7) * 0.4 +
          (input.strategicFit ?? 0.75) * 0.25 +
          (input.impact ?? 0.7) * 0.2 +
          (1 - (input.risk ?? 0.35)) * 0.15,
      ),
    );

    const upside = Math.round(probability * (input.impact ?? 0.7) * 100);
    const downside = Math.round((input.risk ?? 0.35) * 100);
    const expectedValue = Number((upside - downside * 0.6).toFixed(2));

    return {
      horizonDays: input.urgency && input.urgency >= 0.8 ? 30 : 90,
      probability: Number(probability.toFixed(3)),
      upside,
      downside,
      expectedValue,
    };
  }
}