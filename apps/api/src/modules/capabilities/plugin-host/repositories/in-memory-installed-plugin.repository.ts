import { Injectable } from '@nestjs/common';

import type {
  InstalledPluginContract,
  InstalledPluginRepository,
} from '../contracts';

@Injectable()
export class InMemoryInstalledPluginRepository
  implements InstalledPluginRepository
{
  private readonly plugins =
    new Map<string, InstalledPluginContract>();

  async save(
    plugin: InstalledPluginContract,
  ): Promise<InstalledPluginContract> {
    this.plugins.set(plugin.pluginKey, plugin);
    return plugin;
  }

  async findByKey(
    pluginKey: string,
  ): Promise<InstalledPluginContract | undefined> {
    return this.plugins.get(pluginKey);
  }

  async exists(pluginKey: string): Promise<boolean> {
    return this.plugins.has(pluginKey);
  }

  async findAll(): Promise<
    readonly InstalledPluginContract[]
  > {
    return [...this.plugins.values()];
  }

  async delete(pluginKey: string): Promise<void> {
    this.plugins.delete(pluginKey);
  }

  async clear(): Promise<void> {
    this.plugins.clear();
  }
}