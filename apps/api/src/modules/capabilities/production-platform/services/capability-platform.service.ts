import {
  Injectable,
} from '@nestjs/common';

import {
  CapabilityRegistryEngineService,
} from '../../registry-engine';
import {
  CapabilityRuntimeEngineService,
} from '../../runtime-engine';
import {
  DependencyResolverEngineService,
} from '../../dependency-resolver';
import {
  PluginHostEngineService,
} from '../../plugin-host';
import type {
  CapabilityPlatformHealth,
  CapabilityPlatformHealthState,
  CapabilityPlatformMetrics,
  CapabilityPlatformStatus,
} from '../contracts';
import {
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';

@Injectable()
export class CapabilityPlatformService {
  constructor(
    readonly registry:
      CapabilityRegistryEngineService,
    readonly runtime:
      CapabilityRuntimeEngineService,
    readonly dependencyResolver:
      DependencyResolverEngineService,
    readonly pluginHost:
      PluginHostEngineService,
    readonly audit:
      CapabilityPlatformAuditService,
  ) {}

  async status(): Promise<
    CapabilityPlatformStatus
  > {
    try {
      const snapshot =
        await this.createSnapshot();

      const state =
        snapshot.failedRuntimeInstances > 0 ||
        snapshot.failedPlugins > 0
          ? 'degraded'
          : 'operational';

      const result:
        CapabilityPlatformStatus = {
          name:
            'CreatorOS Capability Platform',
          version: '1.1.0',
          state,
          registry: {
            registeredCapabilities:
              snapshot.registeredCapabilities,
          },
          runtime: {
            totalInstances:
              snapshot.runtimeInstances,
            activeInstances:
              snapshot.activeRuntimeInstances,
            stoppedInstances:
              snapshot.stoppedRuntimeInstances,
            failedInstances:
              snapshot.failedRuntimeInstances,
          },
          plugins: {
            installedPlugins:
              snapshot.installedPlugins,
            activePlugins:
              snapshot.activePlugins,
            inactivePlugins:
              snapshot.inactivePlugins,
            failedPlugins:
              snapshot.failedPlugins,
          },
          systems: {
            registryEngine: true,
            runtimeEngine: true,
            dependencyResolver: true,
            pluginHost: true,
            persistentRegistry: true,
            audit: true,
          },
          generatedAt:
            new Date().toISOString(),
        };

      this.audit.record({
        operation:
          'platform.status-read',
        successful: true,
        metadata: {
          state: result.state,
        },
      });

      return result;
    } catch (error) {
      this.recordFailure(
        'Could not generate platform status.',
        error,
      );

      throw error;
    }
  }

  async health(): Promise<
    CapabilityPlatformHealth
  > {
    try {
      const snapshot =
        await this.createSnapshot();

      const registryStatus:
        CapabilityPlatformHealthState =
        'healthy';

      const runtimeStatus:
        CapabilityPlatformHealthState =
        snapshot.failedRuntimeInstances > 0
          ? 'degraded'
          : 'healthy';

      const pluginHostStatus:
        CapabilityPlatformHealthState =
        snapshot.failedPlugins > 0
          ? 'degraded'
          : 'healthy';

      const overallStatus:
        CapabilityPlatformHealthState =
        runtimeStatus === 'degraded' ||
        pluginHostStatus === 'degraded'
          ? 'degraded'
          : 'healthy';

      const result:
        CapabilityPlatformHealth = {
          name:
            'CreatorOS Capability Platform',
          version: '1.1.0',
          status: overallStatus,
          components: {
            registry: {
              name:
                'Capability Registry Engine',
              status:
                registryStatus,
              message:
                'Registry engine is available.',
            },
            runtime: {
              name:
                'Capability Runtime Engine',
              status:
                runtimeStatus,
              message:
                snapshot.failedRuntimeInstances > 0
                  ? 'One or more runtime instances have failed.'
                  : 'Runtime engine is healthy.',
            },
            dependencyResolver: {
              name:
                'Dependency Resolver Engine',
              status: 'healthy',
              message:
                'Dependency resolver is available.',
            },
            pluginHost: {
              name:
                'Plugin Host Engine',
              status:
                pluginHostStatus,
              message:
                snapshot.failedPlugins > 0
                  ? 'One or more plugins have failed.'
                  : 'Plugin host is healthy.',
            },
            audit: {
              name:
                'Capability Platform Audit',
              status: 'healthy',
              message:
                'Audit service is available.',
            },
          },
          generatedAt:
            new Date().toISOString(),
        };

      this.audit.record({
        operation:
          'platform.health-read',
        successful: true,
        metadata: {
          status:
            result.status,
        },
      });

      return result;
    } catch (error) {
      this.recordFailure(
        'Could not generate platform health.',
        error,
      );

      throw error;
    }
  }

  async metrics(): Promise<
    CapabilityPlatformMetrics
  > {
    try {
      const snapshot =
        await this.createSnapshot();

      const result:
        CapabilityPlatformMetrics = {
          ...snapshot,
          auditEvents:
            this.audit.count(),
          generatedAt:
            new Date().toISOString(),
        };

      this.audit.record({
        operation:
          'platform.metrics-read',
        successful: true,
      });

      return result;
    } catch (error) {
      this.recordFailure(
        'Could not generate platform metrics.',
        error,
      );

      throw error;
    }
  }

  auditRecords() {
    const records =
      this.audit.list();

    this.audit.record({
      operation:
        'platform.audit-read',
      successful: true,
      metadata: {
        returnedRecords:
          records.length,
      },
    });

    return records;
  }

  private async createSnapshot() {
    const registered =
      await this.registry.list();

    const runtimeInstances =
      this.runtime.listInstances();

    const installedPlugins =
      await this.pluginHost.listInstalled();

    return {
      registeredCapabilities:
        registered.length,
      runtimeInstances:
        runtimeInstances.length,
      activeRuntimeInstances:
        runtimeInstances.filter(
          (instance) =>
            instance.status ===
            'running',
        ).length,
      stoppedRuntimeInstances:
        runtimeInstances.filter(
          (instance) =>
            instance.status ===
            'stopped',
        ).length,
      failedRuntimeInstances:
        runtimeInstances.filter(
          (instance) =>
            instance.status ===
            'failed',
        ).length,
      installedPlugins:
        installedPlugins.length,
      activePlugins:
        installedPlugins.filter(
          (plugin) =>
            plugin.state ===
            'active',
        ).length,
      inactivePlugins:
        installedPlugins.filter(
          (plugin) =>
            plugin.state ===
              'inactive' ||
            plugin.state ===
              'installed',
        ).length,
      failedPlugins:
        installedPlugins.filter(
          (plugin) =>
            plugin.state ===
            'failed',
        ).length,
    };
  }

  private recordFailure(
    message: string,
    error: unknown,
  ): void {
    this.audit.record({
      operation:
        'operation.failed',
      successful: false,
      message,
      metadata: {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
    });
  }
}