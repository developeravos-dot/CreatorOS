import { Injectable } from '@nestjs/common';
import { IntelligenceSignalInput } from './media-intelligence-cloud.types';

@Injectable()
export class SignalRadarEngineService {
  analyze(input: IntelligenceSignalInput) {
    const confidence = this.n(input.confidence ?? 0.7);
    const urgency = this.n(input.urgency ?? 0.55);
    const impact = this.n(input.impact ?? 0.7);
    const novelty = this.n(input.novelty ?? 0.65);
    const strategicFit = this.n(input.strategicFit ?? 0.75);
    const readiness = this.n(input.executionReadiness ?? 0.6);
    const risk = this.n(input.risk ?? 0.35);

    const signalStrength = Number(
      (
        confidence * 0.15 +
        urgency * 0.15 +
        impact * 0.2 +
        novelty * 0.1 +
        strategicFit * 0.2 +
        readiness * 0.1 +
        (1 - risk) * 0.1
      ).toFixed(3),
    );

    return {
      signalStrength,
      priority:
        signalStrength >= 0.82
          ? ('critical' as const)
          : signalStrength >= 0.68
            ? ('high' as const)
            : signalStrength >= 0.5
              ? ('medium' as const)
              : ('low' as const),
      tags: [
        input.domain,
        ...input.markets ?? [],
        ...input.platforms ?? [],
        'intelligence-signal',
      ],
    };
  }

  private n(value: number) {
    return Math.max(0, Math.min(1, value));
  }
}