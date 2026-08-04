import {
  Injectable,
} from '@nestjs/common';

export interface EnterprisePerformanceSample {
  readonly metricId: string;
  readonly throughput: number;
  readonly latencyMs: number;
  readonly errorRate: number;
  readonly saturation: number;
  readonly observedAt: Date;
}

export interface EnterprisePerformanceAssessment {
  readonly score: number;
  readonly status:
    | 'excellent'
    | 'healthy'
    | 'degraded'
    | 'critical';
  readonly bottlenecks:
    readonly string[];
}

@Injectable()
export class EnterprisePerformanceIntelligenceService {
  assess(
    samples:
      readonly EnterprisePerformanceSample[],
  ): EnterprisePerformanceAssessment {
    if (samples.length === 0) {
      throw new Error(
        'At least one performance sample is required.',
      );
    }

    const averageLatency =
      samples.reduce(
        (total, sample) =>
          total + sample.latencyMs,
        0,
      ) / samples.length;

    const averageErrorRate =
      samples.reduce(
        (total, sample) =>
          total + sample.errorRate,
        0,
      ) / samples.length;

    const averageSaturation =
      samples.reduce(
        (total, sample) =>
          total + sample.saturation,
        0,
      ) / samples.length;

    const averageThroughput =
      samples.reduce(
        (total, sample) =>
          total + sample.throughput,
        0,
      ) / samples.length;

    const score = Math.max(
      0,
      Math.min(
        100,
        100 -
          averageLatency / 20 -
          averageErrorRate * 100 -
          averageSaturation * 40 +
          Math.min(
            20,
            averageThroughput / 100,
          ),
      ),
    );

    const bottlenecks:
      string[] = [];

    if (averageLatency > 500) {
      bottlenecks.push(
        'high-latency',
      );
    }

    if (averageErrorRate > 0.02) {
      bottlenecks.push(
        'elevated-error-rate',
      );
    }

    if (averageSaturation > 0.85) {
      bottlenecks.push(
        'resource-saturation',
      );
    }

    return {
      score,
      status:
        score >= 90
          ? 'excellent'
          : score >= 75
            ? 'healthy'
            : score >= 50
              ? 'degraded'
              : 'critical',
      bottlenecks,
    };
  }
}
