import { Injectable } from '@nestjs/common';

import type {
  PluginPackageContract,
  PluginPackageRepository,
} from '../contracts';

@Injectable()
export class InMemoryPluginPackageRepository
  implements PluginPackageRepository
{
  private readonly packages =
    new Map<string, PluginPackageContract>();

  async save(
    pluginPackage: PluginPackageContract,
  ): Promise<PluginPackageContract> {
    this.packages.set(
      pluginPackage.pluginKey,
      pluginPackage,
    );

    return pluginPackage;
  }

  async findByKey(
    pluginKey: string,
  ): Promise<PluginPackageContract | undefined> {
    return this.packages.get(pluginKey);
  }

  async exists(pluginKey: string): Promise<boolean> {
    return this.packages.has(pluginKey);
  }

  async findAll(): Promise<
    readonly PluginPackageContract[]
  > {
    return [...this.packages.values()];
  }

  async delete(pluginKey: string): Promise<void> {
    this.packages.delete(pluginKey);
  }

  async clear(): Promise<void> {
    this.packages.clear();
  }
}