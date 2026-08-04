import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseFailureSignal {
  readonly signalId: string;
  readonly severity: number;
  readonly frequency: number;
  readonly recencyWeight: number;
}

export interface EnterpriseFailurePrediction {
  readonly probability: number;
  readonly level:
    | 'unlikely'
    | 'possible'
    | 'likely'
    | 'imminent';
  readonly dominantSignals:
    readonly string[];
}

@Injectable()
export class EnterpriseFailurePredictionService {
  predict(
    signals:
      readonly EnterpriseFailureSignal[],
  ): EnterpriseFailurePrediction {
    if (signals.length === 0) {
      throw new Error(
        'At least one failure signal is required.',
      );
    }

    const contributions =
      signals.map((signal) => ({
        signalId:
          signal.signalId,
        value:
          Math.max(
            0,
            Math.min(
              1,
              signal.severity,
            ),
          ) *
          Math.max(
            0,
            signal.frequency,
          ) *
          Math.max(
            0,
            Math.min(
              1,
              signal.recencyWeight,
            ),
          ),
      }));

    const raw =
      contributions.reduce(
        (total, item) =>
          total + item.value,
        0,
      ) / signals.length;

    const probability =
      Math.max(
        0,
        Math.min(1, raw),
      );

    return {
      probability,
      level:
        probability >= 0.85
          ? 'imminent'
          : probability >= 0.65
            ? 'likely'
            : probability >= 0.35
              ? 'possible'
              : 'unlikely',
      dominantSignals:
        contributions
          .filter(
            (item) =>
              item.value >= 0.5,
          )
          .sort(
            (left, right) =>
              right.value -
              left.value,
          )
          .map(
            (item) =>
              item.signalId,
          ),
    };
  }
}
