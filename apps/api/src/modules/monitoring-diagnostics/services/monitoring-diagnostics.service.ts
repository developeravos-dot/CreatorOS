import {
  Injectable,
} from '@nestjs/common';

import {
  PersistenceService,
} from '../../persistence';
import {
  CapabilityPlatformService,
} from '../../capabilities/production-platform';
import type {
  ComponentHealthCounts,
  ComponentHealthResult,
  ComponentHealthStatus,
  SystemHealthSummary,
  SystemLivenessResult,
  SystemReadinessResult,
} from '../contracts';
import {
  ComponentHealthCheckService,
} from './component-health-check.service';
import {
  SystemMetricsService,
} from './system-metrics.service';

@Injectable()
export class MonitoringDiagnosticsService {
  constructor(
    private readonly persistence:
      PersistenceService,
    private readonly platform:
      CapabilityPlatformService,
    private readonly checker:
      ComponentHealthCheckService,
    private readonly metrics:
      SystemMetricsService,
  ) {}

  async liveness():
    Promise<SystemLivenessResult> {
    const responsivenessMs =
      await this.metrics
        .measureResponsiveness();

    return {
      alive: true,
      status: 'healthy',
      uptimeSeconds:
        process.uptime(),
      responsivenessMs,
      checkedAt:
        new Date().toISOString(),
    };
  }

  async readiness():
    Promise<SystemReadinessResult> {
    const components =
      await this.checkComponents();

    const database =
      components.find(
        (component) =>
          component.component ===
          'database',
      );

    const ready =
      database?.status !==
        'unhealthy' &&
      components.every(
        (component) =>
          component.status !==
          'unhealthy',
      );

    return {
      ready,
      status:
        this.resolveOverallStatus(
          components,
          true,
        ),
      components,
      checkedAt:
        new Date().toISOString(),
    };
  }

  async health():
    Promise<SystemHealthSummary> {
    const components =
      await this.checkComponents();

    const uptimeSeconds =
      process.uptime();

    return {
      status:
        this.resolveOverallStatus(
          components,
          true,
        ),
      uptimeSeconds,
      startedAt:
        new Date(
          Date.now() -
          uptimeSeconds * 1_000,
        ).toISOString(),
      checkedAt:
        new Date().toISOString(),
      nodeVersion:
        process.version,
      processId:
        process.pid,
      environment:
        this.safeEnvironmentName(),
      counts:
        this.countStatuses(
          components,
        ),
      components,
    };
  }

  async checkComponents():
    Promise<
      readonly ComponentHealthResult[]
    > {
    const results =
      await Promise.all([
        this.checkDatabase(),
        this.checkRegistry(),
        this.checkRuntime(),
        this.checkDependencyResolver(),
        this.checkPluginHost(),
      ]);

    return results.map(
      (result) => ({
        ...result,
        details: {
          ...result.details,
        },
      }),
    );
  }

  async checkDatabase():
    Promise<ComponentHealthResult> {
    return this.checker.run(
      {
        component:
          'database',
      },
      async () => {
        const health =
          await this.persistence
            .getHealth();

        const record =
          this.toRecord(health);

        const status =
          String(
            record.status ??
            '',
          ).toLowerCase();

        const healthy =
          status === 'healthy' ||
          status === 'operational';

        return {
          status: healthy
            ? 'healthy'
            : 'unhealthy',
          message: healthy
            ? 'Database is available.'
            : 'Database is unavailable.',
          details: {
            available:
              healthy,
            provider:
              this.safeString(
                record.provider,
              ),
          },
        };
      },
    );
  }

  async checkRegistry():
    Promise<ComponentHealthResult> {
    return this.checker.run(
      {
        component:
          'capability-registry',
      },
      async () => {
        const records =
          await this.platform.registry
            .listRecords();

        const states =
          this.countByState(
            records,
            (record) =>
              record.state,
          );

        const invalid =
          records.filter(
            (record) =>
              String(record.state)
                .toLowerCase() ===
              'invalid',
          ).length;

        return {
          status: invalid > 0
            ? 'degraded'
            : 'healthy',
          message: invalid > 0
            ? 'Capability registry contains invalid records.'
            : 'Capability registry is healthy.',
          details: {
            total:
              records.length,
            valid:
              records.length -
              invalid,
            invalid,
            states,
          },
        };
      },
    );
  }

  async checkRuntime():
    Promise<ComponentHealthResult> {
    return this.checker.run(
      {
        component:
          'capability-runtime',
      },
      () => {
        const instances =
          this.platform.runtime
            .listInstances();

        const states =
          this.countByState(
            instances,
            (instance) =>
              instance.status,
          );

        const failed =
          states.failed ?? 0;

        const running =
          states.running ?? 0;

        const stopped =
          states.stopped ?? 0;

        return {
          status: failed > 0
            ? 'degraded'
            : 'healthy',
          message: failed > 0
            ? 'Capability runtime contains failed instances.'
            : 'Capability runtime is healthy.',
          details: {
            total:
              instances.length,
            running,
            stopped,
            failed,
            transitional:
              instances.length -
              running -
              stopped -
              failed,
            states,
          },
        };
      },
    );
  }

  async checkDependencyResolver():
    Promise<ComponentHealthResult> {
    return this.checker.run(
      {
        component:
          'dependency-resolver',
      },
      () => {
        const available =
          Boolean(
            this.platform
              .dependencyResolver,
          );

        return {
          status: available
            ? 'healthy'
            : 'unhealthy',
          message: available
            ? 'Dependency resolver is available and stateless.'
            : 'Dependency resolver is unavailable.',
          details: {
            available,
            stateless: true,
          },
        };
      },
    );
  }

  async checkPluginHost():
    Promise<ComponentHealthResult> {
    return this.checker.run(
      {
        component:
          'plugin-host',
      },
      async () => {
        const plugins =
          await this.platform.pluginHost
            .listInstalled();

        const states =
          this.countByState(
            plugins,
            (plugin) =>
              plugin.state,
          );

        const failed =
          states.failed ?? 0;

        return {
          status: failed > 0
            ? 'degraded'
            : 'healthy',
          message: failed > 0
            ? 'Plugin host contains failed plugins.'
            : 'Plugin host is healthy.',
          details: {
            total:
              plugins.length,
            active:
              states.active ?? 0,
            inactive:
              states.inactive ?? 0,
            installed:
              states.installed ?? 0,
            failed,
            withRuntimeInstance:
              plugins.filter(
                (plugin) =>
                  Boolean(
                    plugin
                      .runtimeInstanceId,
                  ),
              ).length,
            states,
          },
        };
      },
    );
  }

  private resolveOverallStatus(
    components:
      readonly ComponentHealthResult[],
    databaseIsCritical: boolean,
  ): ComponentHealthStatus {
    const database =
      components.find(
        (component) =>
          component.component ===
          'database',
      );

    if (
      databaseIsCritical &&
      database?.status ===
        'unhealthy'
    ) {
      return 'unhealthy';
    }

    if (
      components.some(
        (component) =>
          component.status ===
          'unhealthy',
      )
    ) {
      return 'unhealthy';
    }

    if (
      components.some(
        (component) =>
          component.status ===
            'degraded' ||
          component.status ===
            'unknown',
      )
    ) {
      return 'degraded';
    }

    return 'healthy';
  }

  private countStatuses(
    components:
      readonly ComponentHealthResult[],
  ): ComponentHealthCounts {
    return {
      healthy:
        components.filter(
          (component) =>
            component.status ===
            'healthy',
        ).length,
      degraded:
        components.filter(
          (component) =>
            component.status ===
            'degraded',
        ).length,
      unhealthy:
        components.filter(
          (component) =>
            component.status ===
            'unhealthy',
        ).length,
      unknown:
        components.filter(
          (component) =>
            component.status ===
            'unknown',
        ).length,
    };
  }

  private countByState<T>(
    values: readonly T[],
    selector:
      (value: T) =>
        string,
  ): Readonly<Record<string, number>> {
    const result:
      Record<string, number> = {};

    for (const value of values) {
      const state =
        String(
          selector(value),
        ).toLowerCase();

      result[state] =
        (result[state] ?? 0) +
        1;
    }

    return result;
  }

  private safeEnvironmentName():
    string | undefined {
    const value =
      process.env.NODE_ENV
        ?.trim();

    if (!value) {
      return undefined;
    }

    return value.replace(
      /[^a-zA-Z0-9_-]/g,
      '',
    );
  }

  private toRecord(
    value: unknown,
  ): Record<string, unknown> {
    if (
      typeof value !== 'object' ||
      value === null ||
      Array.isArray(value)
    ) {
      return {};
    }

    return value as
      Record<string, unknown>;
  }

  private safeString(
    value: unknown,
  ): string | undefined {
    return typeof value ===
      'string'
      ? value
      : undefined;
  }
}