import { Injectable } from '@nestjs/common';

export interface RuntimeMetric {
  readonly name: string;
  readonly value: number;
  readonly labels:
    Readonly<Record<string, string>>;
  readonly recordedAt: Date;
}

export interface RuntimeTraceSpan {
  readonly spanId: string;
  readonly traceId: string;
  readonly parentSpanId: string | null;
  readonly name: string;
  readonly startedAt: Date;
  readonly completedAt: Date | null;
  readonly attributes:
    Readonly<Record<string, string | number | boolean>>;
}

export interface RuntimeIncident {
  readonly incidentId: string;
  readonly severity:
    | 'info'
    | 'warning'
    | 'critical';
  readonly title: string;
  readonly details: string;
  readonly openedAt: Date;
  readonly resolvedAt: Date | null;
}

@Injectable()
export class RuntimeObservabilityService {
  private readonly metrics:
    RuntimeMetric[] = [];

  private readonly spans =
    new Map<string, RuntimeTraceSpan>();

  private readonly incidents =
    new Map<string, RuntimeIncident>();

  recordMetric(input: {
    readonly name: string;
    readonly value: number;
    readonly labels?: Readonly<
      Record<string, string>
    >;
    readonly now?: Date;
  }): RuntimeMetric {
    const name = input.name.trim();

    if (
      !name ||
      !Number.isFinite(input.value)
    ) {
      throw new Error(
        'Metric name and finite value are required.',
      );
    }

    const metric: RuntimeMetric = {
      name,
      value: input.value,
      labels: {
        ...(input.labels ?? {}),
      },
      recordedAt: new Date(
        input.now ?? new Date(),
      ),
    };

    this.metrics.push(metric);
    return this.cloneMetric(metric);
  }

  startSpan(input: {
    readonly spanId: string;
    readonly traceId: string;
    readonly parentSpanId?: string | null;
    readonly name: string;
    readonly attributes?: Readonly<
      Record<
        string,
        string | number | boolean
      >
    >;
    readonly now?: Date;
  }): RuntimeTraceSpan {
    const spanId = input.spanId.trim();
    const traceId = input.traceId.trim();
    const name = input.name.trim();

    if (!spanId || !traceId || !name) {
      throw new Error(
        'spanId, traceId and name are required.',
      );
    }

    if (this.spans.has(spanId)) {
      throw new Error(
        `Runtime span ${spanId} already exists.`,
      );
    }

    const span: RuntimeTraceSpan = {
      spanId,
      traceId,
      parentSpanId:
        input.parentSpanId?.trim() ??
        null,
      name,
      startedAt: new Date(
        input.now ?? new Date(),
      ),
      completedAt: null,
      attributes: {
        ...(input.attributes ?? {}),
      },
    };

    this.spans.set(spanId, span);
    return this.cloneSpan(span);
  }

  finishSpan(
    spanId: string,
    now = new Date(),
  ): RuntimeTraceSpan {
    const current =
      this.spans.get(spanId);

    if (!current) {
      throw new Error(
        `Runtime span ${spanId} was not found.`,
      );
    }

    const completed: RuntimeTraceSpan = {
      ...current,
      completedAt: new Date(now),
    };

    this.spans.set(spanId, completed);
    return this.cloneSpan(completed);
  }

  openIncident(input: {
    readonly incidentId: string;
    readonly severity:
      | 'info'
      | 'warning'
      | 'critical';
    readonly title: string;
    readonly details: string;
    readonly now?: Date;
  }): RuntimeIncident {
    const incidentId =
      input.incidentId.trim();

    if (
      !incidentId ||
      !input.title.trim() ||
      !input.details.trim()
    ) {
      throw new Error(
        'Incident id, title and details are required.',
      );
    }

    if (
      this.incidents.has(incidentId)
    ) {
      throw new Error(
        `Runtime incident ${incidentId} already exists.`,
      );
    }

    const incident: RuntimeIncident = {
      incidentId,
      severity: input.severity,
      title: input.title.trim(),
      details: input.details.trim(),
      openedAt: new Date(
        input.now ?? new Date(),
      ),
      resolvedAt: null,
    };

    this.incidents.set(
      incidentId,
      incident,
    );

    return this.cloneIncident(
      incident,
    );
  }

  resolveIncident(
    incidentId: string,
    now = new Date(),
  ): RuntimeIncident {
    const current =
      this.incidents.get(
        incidentId,
      );

    if (!current) {
      throw new Error(
        `Runtime incident ${incidentId} was not found.`,
      );
    }

    const resolved: RuntimeIncident = {
      ...current,
      resolvedAt: new Date(now),
    };

    this.incidents.set(
      incidentId,
      resolved,
    );

    return this.cloneIncident(
      resolved,
    );
  }

  dashboard() {
    const latestMetrics =
      new Map<string, RuntimeMetric>();

    for (const metric of this.metrics) {
      latestMetrics.set(
        metric.name,
        metric,
      );
    }

    return {
      latestMetrics:
        Object.fromEntries(
          [...latestMetrics.entries()]
            .map(([name, metric]) => [
              name,
              metric.value,
            ]),
        ),
      activeSpans:
        [...this.spans.values()]
          .filter(
            (span) =>
              span.completedAt === null,
          )
          .map((span) =>
            this.cloneSpan(span),
          ),
      openIncidents:
        [...this.incidents.values()]
          .filter(
            (incident) =>
              incident.resolvedAt === null,
          )
          .map((incident) =>
            this.cloneIncident(
              incident,
            ),
          ),
      generatedAt: new Date(),
    };
  }

  private cloneMetric(
    metric: RuntimeMetric,
  ): RuntimeMetric {
    return {
      ...metric,
      labels: {
        ...metric.labels,
      },
      recordedAt: new Date(
        metric.recordedAt,
      ),
    };
  }

  private cloneSpan(
    span: RuntimeTraceSpan,
  ): RuntimeTraceSpan {
    return {
      ...span,
      startedAt: new Date(
        span.startedAt,
      ),
      completedAt: span.completedAt
        ? new Date(span.completedAt)
        : null,
      attributes: {
        ...span.attributes,
      },
    };
  }

  private cloneIncident(
    incident: RuntimeIncident,
  ): RuntimeIncident {
    return {
      ...incident,
      openedAt: new Date(
        incident.openedAt,
      ),
      resolvedAt: incident.resolvedAt
        ? new Date(
            incident.resolvedAt,
          )
        : null,
    };
  }
}
