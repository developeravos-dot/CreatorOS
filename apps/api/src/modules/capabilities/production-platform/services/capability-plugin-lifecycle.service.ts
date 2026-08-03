import {
  Injectable,
} from '@nestjs/common';

import type {
  CapabilityMetadata,
} from '../../contracts';
import type {
  PluginHostOperationResult,
  PluginPackageContract,
} from '../../plugin-host';
import type {
  BulkPluginLifecycleResult,
  PluginLifecycleListResult,
  PluginLifecycleMetrics,
} from '../contracts';
import type {
  ActivateManagedPluginDto,
  BulkPluginLifecycleDto,
  DeactivateManagedPluginDto,
  InstallManagedPluginDto,
  PluginLifecycleListQueryDto,
  UninstallManagedPluginDto,
} from '../dto';
import {
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';
import {
  CapabilityPlatformService,
} from './capability-platform.service';

@Injectable()
export class CapabilityPluginLifecycleService {
  constructor(
    private readonly platform:
      CapabilityPlatformService,
    private readonly audit:
      CapabilityPlatformAuditService,
  ) {}

  async list(
    query:
      PluginLifecycleListQueryDto = {},
  ): Promise<PluginLifecycleListResult> {
    const plugins =
      await this.platform.pluginHost
        .listInstalled();

    const search =
      query.search
        ?.trim()
        .toLowerCase();

    const state =
      query.state
        ?.trim()
        .toLowerCase();

    const filtered =
      plugins.filter((plugin) => {
        if (
          state &&
          plugin.state
            .toLowerCase() !== state
        ) {
          return false;
        }

        if (search) {
          const value = [
            plugin.pluginKey,
            plugin.capabilityId,
            plugin.version,
            plugin.state,
          ]
            .join(' ')
            .toLowerCase();

          if (!value.includes(search)) {
            return false;
          }
        }

        return true;
      });

    this.recordSuccess(
      'management.plugins-read',
      'plugin-host',
      {
        total:
          plugins.length,
        returned:
          filtered.length,
      },
    );

    return {
      count:
        filtered.length,
      total:
        plugins.length,
      plugins:
        filtered,
    };
  }

  async get(
    pluginKey: string,
  ) {
    const plugin =
      await this.platform.pluginHost
        .getInstalled(pluginKey);

    this.recordSuccess(
      'management.plugin-read',
      pluginKey,
      {
        found:
          Boolean(plugin),
      },
    );

    return plugin;
  }

  async getPackage(
    pluginKey: string,
  ) {
    const pluginPackage =
      await this.platform.pluginHost
        .getPackage(pluginKey);

    this.recordSuccess(
      'management.plugin-package-read',
      pluginKey,
      {
        found:
          Boolean(pluginPackage),
      },
    );

    return pluginPackage;
  }

  async install(
    input:
      InstallManagedPluginDto,
  ) {
    const pluginPackage =
      input.package as unknown as
        PluginPackageContract;

    const pluginKey =
      pluginPackage?.pluginKey ??
      'unknown-plugin';

    try {
      const result =
        await this.platform.pluginHost
          .install({
            package:
              pluginPackage,
          });

      this.recordSuccess(
        'plugin.installed',
        pluginKey,
        {
          capabilityId:
            result.capabilityId,
          currentState:
            result.currentState,
        },
        input.actorId,
        input.correlationId,
      );

      return result;
    } catch (error) {
      this.recordFailure(
        'plugin.installed',
        pluginKey,
        error,
        input.actorId,
        input.correlationId,
      );

      throw error;
    }
  }

  async activate(
    pluginKey: string,
    input:
      ActivateManagedPluginDto = {},
  ) {
    try {
      const result =
        await this.platform.pluginHost
          .activate({
            pluginKey,
            metadata:
              input.metadata as
                | CapabilityMetadata
                | undefined,
            actorId:
              input.actorId,
            correlationId:
              input.correlationId,
          });

      this.recordSuccess(
        'plugin.activated',
        pluginKey,
        this.operationMetadata(result),
        input.actorId,
        input.correlationId,
      );

      return result;
    } catch (error) {
      this.recordFailure(
        'plugin.activated',
        pluginKey,
        error,
        input.actorId,
        input.correlationId,
      );

      throw error;
    }
  }

  async deactivate(
    pluginKey: string,
    input:
      DeactivateManagedPluginDto = {},
  ) {
    try {
      const result =
        await this.platform.pluginHost
          .deactivate({
            pluginKey,
            reason:
              input.reason,
            actorId:
              input.actorId,
            correlationId:
              input.correlationId,
          });

      this.recordSuccess(
        'plugin.deactivated',
        pluginKey,
        this.operationMetadata(result),
        input.actorId,
        input.correlationId,
      );

      return result;
    } catch (error) {
      this.recordFailure(
        'plugin.deactivated',
        pluginKey,
        error,
        input.actorId,
        input.correlationId,
      );

      throw error;
    }
  }

  async uninstall(
    pluginKey: string,
    input:
      UninstallManagedPluginDto = {},
  ) {
    try {
      const result =
        await this.platform.pluginHost
          .uninstall({
            pluginKey,
            force:
              input.force,
            reason:
              input.reason,
            actorId:
              input.actorId,
            correlationId:
              input.correlationId,
          });

      this.recordSuccess(
        'plugin.uninstalled',
        pluginKey,
        this.operationMetadata(result),
        input.actorId,
        input.correlationId,
      );

      return result;
    } catch (error) {
      this.recordFailure(
        'plugin.uninstalled',
        pluginKey,
        error,
        input.actorId,
        input.correlationId,
      );

      throw error;
    }
  }

  async metrics():
    Promise<PluginLifecycleMetrics> {
    const plugins =
      await this.platform.pluginHost
        .listInstalled();

    const states:
      Record<string, number> = {};

    for (const plugin of plugins) {
      states[plugin.state] =
        (states[plugin.state] ?? 0) +
        1;
    }

    const countState = (
      state: string,
    ) =>
      states[state] ?? 0;

    const result:
      PluginLifecycleMetrics = {
        totalPlugins:
          plugins.length,
        activePlugins:
          countState('active'),
        inactivePlugins:
          countState('inactive'),
        installedPlugins:
          countState('installed'),
        failedPlugins:
          countState('failed'),
        pluginsWithRuntime:
          plugins.filter(
            (plugin) =>
              Boolean(
                plugin.runtimeInstanceId,
              ),
          ).length,
        states,
        generatedAt:
          new Date().toISOString(),
      };

    this.recordSuccess(
      'management.plugin-metrics-read',
      'plugin-host',
      {
        totalPlugins:
          result.totalPlugins,
        activePlugins:
          result.activePlugins,
        failedPlugins:
          result.failedPlugins,
      },
    );

    return result;
  }

  async bulk(
    input:
      BulkPluginLifecycleDto,
  ): Promise<
    BulkPluginLifecycleResult
  > {
    const pluginKeys = [
      ...new Set(
        input.pluginKeys,
      ),
    ];

    const results:
      {
        pluginKey: string;
        successful: boolean;
        result?:
          PluginHostOperationResult;
        error?: string;
      }[] = [];

    for (
      const pluginKey
      of pluginKeys
    ) {
      try {
        let result:
          PluginHostOperationResult;

        switch (input.operation) {
          case 'activate':
            result =
              await this.platform
                .pluginHost.activate({
                  pluginKey,
                  metadata:
                    input.metadata as
                      | CapabilityMetadata
                      | undefined,
                  actorId:
                    input.actorId,
                  correlationId:
                    input.correlationId,
                });
            break;

          case 'deactivate':
            result =
              await this.platform
                .pluginHost.deactivate({
                  pluginKey,
                  reason:
                    input.reason,
                  actorId:
                    input.actorId,
                  correlationId:
                    input.correlationId,
                });
            break;

          case 'uninstall':
            result =
              await this.platform
                .pluginHost.uninstall({
                  pluginKey,
                  force:
                    input.force,
                  reason:
                    input.reason,
                  actorId:
                    input.actorId,
                  correlationId:
                    input.correlationId,
                });
            break;
        }

        results.push({
          pluginKey,
          successful: true,
          result,
        });

        this.recordSuccess(
          `plugin.bulk-${input.operation}`,
          pluginKey,
          {
            bulk: true,
            currentState:
              result.currentState,
            changed:
              result.changed,
          },
          input.actorId,
          input.correlationId,
        );
      } catch (error) {
        results.push({
          pluginKey,
          successful: false,
          error:
            this.errorMessage(
              error,
            ),
        });

        this.recordFailure(
          `plugin.bulk-${input.operation}`,
          pluginKey,
          error,
          input.actorId,
          input.correlationId,
          {
            bulk: true,
          },
        );

        if (
          input.continueOnError ===
          false
        ) {
          break;
        }
      }
    }

    const succeeded =
      results.filter(
        (item) =>
          item.successful,
      ).length;

    const result:
      BulkPluginLifecycleResult = {
        operation:
          input.operation,
        requested:
          pluginKeys.length,
        processed:
          results.length,
        succeeded,
        failed:
          results.length -
          succeeded,
        results,
        completedAt:
          new Date().toISOString(),
      };

    this.recordSuccess(
      'management.plugin-bulk-completed',
      'plugin-host',
      {
        operation:
          result.operation,
        requested:
          result.requested,
        processed:
          result.processed,
        succeeded:
          result.succeeded,
        failed:
          result.failed,
      },
      input.actorId,
      input.correlationId,
    );

    return result;
  }

  private operationMetadata(
    result:
      PluginHostOperationResult,
  ): Readonly<Record<string, unknown>> {
    return {
      capabilityId:
        result.capabilityId,
      previousState:
        result.previousState,
      currentState:
        result.currentState,
      changed:
        result.changed,
      runtimeInstanceId:
        result.runtimeInstanceId,
    };
  }

  private recordSuccess(
    operation:
      | `plugin.${string}`
      | `management.${string}`,
    subjectId: string,
    metadata:
      Readonly<Record<string, unknown>> =
        {},
    actorId?: string,
    correlationId?: string,
  ): void {
    this.audit.record({
      operation,
      successful: true,
      subjectId,
      actorId,
      correlationId,
      metadata,
    });
  }

  private recordFailure(
    requestedOperation: string,
    subjectId: string,
    error: unknown,
    actorId?: string,
    correlationId?: string,
    metadata:
      Readonly<Record<string, unknown>> =
        {},
  ): void {
    this.audit.record({
      operation:
        'operation.failed',
      successful: false,
      subjectId,
      actorId,
      correlationId,
      message:
        this.errorMessage(
          error,
        ),
      metadata: {
        requestedOperation,
        ...metadata,
      },
    });
  }

  private errorMessage(
    error: unknown,
  ): string {
    return error instanceof Error
      ? error.message
      : String(error);
  }
}