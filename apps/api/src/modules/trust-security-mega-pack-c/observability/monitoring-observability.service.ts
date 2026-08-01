import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  HealthCheck,
  HealthMetric,
} from '../trust-security.types';

@Injectable()
export class MonitoringObservabilityService {
  private readonly metrics: HealthMetric[] = [];
  private readonly checks = new Map<
    string,
    HealthCheck
  >();

  recordMetric(input: {
    component: string;
    name: string;
    value: number;
    unit: string;
  }) {
    const metric: HealthMetric = {
      id: randomUUID(),
      ...input,
      recordedAt: new Date().toISOString(),
    };

    this.metrics.push(metric);
    return metric;
  }

  updateHealth(
    component: string,
    status: HealthCheck['status'],
    details: Record<string, unknown> = {},
  ) {
    const check: HealthCheck = {
      component,
      status,
      details,
      checkedAt: new Date().toISOString(),
    };

    this.checks.set(component, check);
    return check;
  }

  summary() {
    const checks = [...this.checks.values()];

    return {
      status: checks.some(
        (check) => check.status === 'unhealthy',
      )
        ? 'unhealthy'
        : checks.some(
              (check) =>
                check.status === 'degraded',
            )
          ? 'degraded'
          : 'healthy',
      components: checks.length,
      healthy: checks.filter(
        (check) => check.status === 'healthy',
      ).length,
      degraded: checks.filter(
        (check) => check.status === 'degraded',
      ).length,
      unhealthy: checks.filter(
        (check) => check.status === 'unhealthy',
      ).length,
      metrics: this.metrics.length,
    };
  }

  listMetrics() {
    return [...this.metrics];
  }

  listHealthChecks() {
    return [...this.checks.values()];
  }
}