import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PluginDefinition } from '../extension-operations.types';

@Injectable()
export class PluginMarketplaceService {
  private readonly plugins = new Map<
    string,
    PluginDefinition
  >();

  register(input: {
    key: string;
    name: string;
    version: string;
    publisher: string;
    capabilities: string[];
    permissions?: string[];
    metadata?: Record<string, unknown>;
  }) {
    const existing = this.plugins.get(input.key);

    if (existing) {
      return existing;
    }

    const plugin: PluginDefinition = {
      id: randomUUID(),
      key: input.key,
      name: input.name,
      version: input.version,
      publisher: input.publisher,
      capabilities: input.capabilities,
      permissions: input.permissions ?? [],
      metadata: input.metadata ?? {},
      status: 'registered',
    };

    this.plugins.set(plugin.key, plugin);
    return plugin;
  }

  install(key: string) {
    const plugin = this.get(key);
    plugin.status = 'installed';
    plugin.installedAt = new Date().toISOString();
    return plugin;
  }

  enable(key: string) {
    const plugin = this.get(key);

    if (
      plugin.status !== 'installed' &&
      plugin.status !== 'disabled'
    ) {
      throw new Error(
        `Plugin must be installed before enable: ${key}`,
      );
    }

    plugin.status = 'enabled';
    plugin.enabledAt = new Date().toISOString();
    return plugin;
  }

  disable(key: string) {
    const plugin = this.get(key);
    plugin.status = 'disabled';
    return plugin;
  }

  get(key: string) {
    const plugin = this.plugins.get(key);

    if (!plugin) {
      throw new Error(`Plugin not found: ${key}`);
    }

    return plugin;
  }

  list() {
    return [...this.plugins.values()];
  }

  summary() {
    const plugins = this.list();

    return {
      total: plugins.length,
      installed: plugins.filter(
        (plugin) =>
          plugin.status === 'installed' ||
          plugin.status === 'enabled' ||
          plugin.status === 'disabled',
      ).length,
      enabled: plugins.filter(
        (plugin) => plugin.status === 'enabled',
      ).length,
      failed: plugins.filter(
        (plugin) => plugin.status === 'failed',
      ).length,
    };
  }
}