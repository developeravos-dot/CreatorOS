import type {
  PluginPackageContract,
} from './plugin-host.types';

export interface PluginPackageRepository {
  save(
    pluginPackage: PluginPackageContract,
  ): Promise<PluginPackageContract>;

  findByKey(
    pluginKey: string,
  ): Promise<PluginPackageContract | undefined>;

  exists(pluginKey: string): Promise<boolean>;

  findAll(): Promise<readonly PluginPackageContract[]>;

  delete(pluginKey: string): Promise<void>;

  clear(): Promise<void>;
}