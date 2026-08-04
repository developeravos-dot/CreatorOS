import {
  Injectable,
} from '@nestjs/common';

import type {
  EnterpriseSignal,
} from '../contracts';

export interface EnterprisePrediction {
  readonly predictionId: string;
  readonly category:
    EnterpriseSignal['category'];
  readonly currentValue: number;
  readonly predictedValue: number;
  readonly direction:
    | 'increase'
    | 'decrease'
    | 'stable';
  readonly confidence: number;
  readonly generatedAt: Date;
}

@Injectable()
export class EnterprisePredictionEngineService {
  predict(input: {
    readonly predictionId: string;
    readonly signals:
      readonly EnterpriseSignal[];
    readonly horizonFactor?: number;
    readonly now?: Date;
  }): EnterprisePrediction {
    const predictionId =
      input.predictionId.trim();

    if (
      !predictionId ||
      input.signals.length < 2
    ) {
      throw new Error(
        'Prediction requires an id and at least two signals.',
      );
    }

    const ordered =
      [...input.signals].sort(
        (left, right) =>
          left.observedAt.getTime() -
          right.observedAt.getTime(),
      );

    const category =
      ordered[0]!.category;

    if (
      ordered.some(
        (signal) =>
          signal.category !== category,
      )
    ) {
      throw new Error(
        'Prediction signals must share one category.',
      );
    }

    const first = ordered[0]!;
    const last =
      ordered[ordered.length - 1]!;

    const trend =
      last.value - first.value;

    const predictedValue =
      last.value +
      trend *
        (input.horizonFactor ?? 1);

    const tolerance =
      Math.max(
        0.0001,
        Math.abs(last.value) * 0.01,
      );

    return {
      predictionId,
      category,
      currentValue: last.value,
      predictedValue,
      direction:
        Math.abs(trend) <= tolerance
          ? 'stable'
          : trend > 0
            ? 'increase'
            : 'decrease',
      confidence:
        ordered.reduce(
          (total, signal) =>
            total +
            signal.confidence,
          0,
        ) / ordered.length,
      generatedAt: new Date(
        input.now ?? new Date(),
      ),
    };
  }
}
