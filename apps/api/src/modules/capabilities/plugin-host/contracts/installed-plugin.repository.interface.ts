import type {
  InstalledPluginContract,
} from './plugin-host.types';

export interface InstalledPluginRepository {
  save(
    plugin: InstalledPluginContract,
  ): Promise<InstalledPluginContract>;

  findByKey(
    pluginKey: string,
  ): Promise<InstalledPluginContract | undefined>;

  exists(pluginKey: string): Promise<boolean>;

  findAll(): Promise<readonly InstalledPluginContract[]>;

  delete(pluginKey: string): Promise<void>;

  clear(): Promise<void>;
}