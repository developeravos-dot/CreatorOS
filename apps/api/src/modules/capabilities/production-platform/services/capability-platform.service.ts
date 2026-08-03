import { Injectable } from '@nestjs/common';

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
  CapabilityPlatformStatus,
} from '../contracts';

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
  ) {}

  async status(): Promise<
    CapabilityPlatformStatus
  > {
    const registered =
      await this.registry.list();

    const runtimeInstances =
      this.runtime.listInstances();

    const installedPlugins =
      await this.pluginHost.listInstalled();

    const activeInstances =
      runtimeInstances.filter(
        (instance) =>
          instance.status === 'running',
      );

    const stoppedInstances =
      runtimeInstances.filter(
        (instance) =>
          instance.status === 'stopped',
      );

    const failedInstances =
      runtimeInstances.filter(
        (instance) =>
          instance.status === 'failed',
      );

    const activePlugins =
      installedPlugins.filter(
        (plugin) =>
          plugin.state === 'active',
      );

    const inactivePlugins =
      installedPlugins.filter(
        (plugin) =>
          plugin.state === 'inactive' ||
          plugin.state === 'installed',
      );

    const failedPlugins =
      installedPlugins.filter(
        (plugin) =>
          plugin.state === 'failed',
      );

    const state =
      failedInstances.length > 0 ||
      failedPlugins.length > 0
        ? 'degraded'
        : 'operational';

    return {
      name:
        'CreatorOS Capability Platform',
      version: '1.1.0',
      state,
      registry: {
        registeredCapabilities:
          registered.length,
      },
      runtime: {
        totalInstances:
          runtimeInstances.length,
        activeInstances:
          activeInstances.length,
        stoppedInstances:
          stoppedInstances.length,
        failedInstances:
          failedInstances.length,
      },
      plugins: {
        installedPlugins:
          installedPlugins.length,
        activePlugins:
          activePlugins.length,
        inactivePlugins:
          inactivePlugins.length,
        failedPlugins:
          failedPlugins.length,
      },
      systems: {
        registryEngine: true,
        runtimeEngine: true,
        dependencyResolver: true,
        pluginHost: true,
        persistentRegistry: true,
      },
      generatedAt:
        new Date().toISOString(),
    };
  }
}