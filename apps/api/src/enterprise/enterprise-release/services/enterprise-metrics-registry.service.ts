import {
  Injectable,
} from '@nestjs/common';

export interface EnterpriseMetricPoint {
  readonly metric: string;
  readonly value: number;
  readonly labels:
    Readonly<Record<string, string>>;
  readonly recordedAt: Date;
}

@Injectable()
export class EnterpriseMetricsRegistryService {
  private readonly points:
    EnterpriseMetricPoint[] = [];

  record(input: {
    readonly metric: string;
    readonly value: number;
    readonly labels?: Readonly<
      Record<string, string>
    >;
    readonly now?: Date;
  }): EnterpriseMetricPoint {
    const metric =
      input.metric.trim();

    if (
      !metric ||
      !Number.isFinite(
        input.value,
      )
    ) {
      throw new Error(
        'Metric name and finite value are required.',
      );
    }

    const point:
      EnterpriseMetricPoint = {
        metric,
        value: input.value,
        labels: {
          ...(input.labels ?? {}),
        },
        recordedAt: new Date(
          input.now ?? new Date(),
        ),
      };

    this.points.push(point);
    return this.clone(point);
  }

  latest(
    metric: string,
  ): EnterpriseMetricPoint | null {
    const point =
      [...this.points]
        .reverse()
        .find(
          (item) =>
            item.metric ===
            metric.trim(),
        );

    return point
      ? this.clone(point)
      : null;
  }

  query(input: {
    readonly metric?: string;
    readonly since?: Date;
  } = {}):
    readonly EnterpriseMetricPoint[] {
    return this.points
      .filter(
        (point) =>
          !input.metric ||
          point.metric ===
            input.metric.trim(),
      )
      .filter(
        (point) =>
          !input.since ||
          point.recordedAt >=
            input.since,
      )
      .map((point) =>
        this.clone(point),
      );
  }

  private clone(
    point: EnterpriseMetricPoint,
  ): EnterpriseMetricPoint {
    return {
      ...point,
      labels: {
        ...point.labels,
      },
      recordedAt: new Date(
        point.recordedAt,
      ),
    };
  }
}
