import {
  Injectable,
} from '@nestjs/common';

import type {
  ComponentHealthResult,
  SystemMetricsSummary,
} from '../contracts';
import {
  MonitoringDiagnosticsService,
} from './monitoring-diagnostics.service';
import {
  SystemMetricsService,
} from './system-metrics.service';

@Injectable()
export class MonitoringMetricsService {
  constructor(
    private readonly monitoring:
      MonitoringDiagnosticsService,
    private readonly systemMetrics:
      SystemMetricsService,
  ) {}

  async getMetrics():
    Promise<SystemMetricsSummary> {
    const [
      processMetrics,
      database,
      registry,
      runtime,
      dependencyResolver,
      pluginHost,
    ] = await Promise.all([
      this.systemMetrics
        .getProcessMetrics(),
      this.monitoring
        .checkDatabase(),
      this.monitoring
        .checkRegistry(),
      this.monitoring
        .checkRuntime(),
      this.monitoring
        .checkDependencyResolver(),
      this.monitoring
        .checkPluginHost(),
    ]);

    const registryDetails =
      this.details(registry);

    const runtimeDetails =
      this.details(runtime);

    const dependencyDetails =
      this.details(
        dependencyResolver,
      );

    const pluginDetails =
      this.details(pluginHost);

    return {
      process:
        processMetrics,
      database: {
        status:
          database.status,
        healthy:
          database.status ===
          'healthy',
        latencyMs:
          database.latencyMs,
      },
      registry: {
        total:
          this.number(
            registryDetails.total,
          ),
        valid:
          this.number(
            registryDetails.valid,
          ),
        invalid:
          this.number(
            registryDetails.invalid,
          ),
        states:
          this.numberRecord(
            registryDetails.states,
          ),
      },
      runtime: {
        total:
          this.number(
            runtimeDetails.total,
          ),
        running:
          this.number(
            runtimeDetails.running,
          ),
        stopped:
          this.number(
            runtimeDetails.stopped,
          ),
        failed:
          this.number(
            runtimeDetails.failed,
          ),
        transitional:
          this.number(
            runtimeDetails
              .transitional,
          ),
        states:
          this.numberRecord(
            runtimeDetails.states,
          ),
      },
      dependencyResolver: {
        available:
          dependencyDetails
            .available === true,
        stateless:
          dependencyDetails
            .stateless === true,
        message:
          dependencyResolver.message,
      },
      pluginHost: {
        total:
          this.number(
            pluginDetails.total,
          ),
        active:
          this.number(
            pluginDetails.active,
          ),
        inactive:
          this.number(
            pluginDetails.inactive,
          ),
        installed:
          this.number(
            pluginDetails.installed,
          ),
        failed:
          this.number(
            pluginDetails.failed,
          ),
        transitional:
          this.pluginTransitional(
            pluginDetails,
          ),
        withRuntimeInstance:
          this.number(
            pluginDetails
              .withRuntimeInstance,
          ),
        states:
          this.numberRecord(
            pluginDetails.states,
          ),
      },
      generatedAt:
        new Date().toISOString(),
    };
  }

  private pluginTransitional(
    details:
      Readonly<Record<string, unknown>>,
  ): number {
    const total =
      this.number(details.total);

    const known =
      this.number(details.active) +
      this.number(details.inactive) +
      this.number(details.installed) +
      this.number(details.failed);

    return Math.max(
      0,
      total - known,
    );
  }

  private details(
    result:
      ComponentHealthResult,
  ): Readonly<
    Record<string, unknown>
  > {
    return {
      ...result.details,
    };
  }

  private number(
    value: unknown,
  ): number {
    return typeof value ===
        'number' &&
      Number.isFinite(value)
      ? value
      : 0;
  }

  private numberRecord(
    value: unknown,
  ): Readonly<
    Record<string, number>
  > {
    if (
      typeof value !== 'object' ||
      value === null ||
      Array.isArray(value)
    ) {
      return {};
    }

    const result:
      Record<string, number> =
        {};

    for (
      const [key, item]
      of Object.entries(value)
    ) {
      if (
        typeof item ===
          'number' &&
        Number.isFinite(item)
      ) {
        result[key] =
          item;
      }
    }

    return result;
  }
}