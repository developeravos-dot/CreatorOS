import type {
  DependencyResolverCatalogEntry,
} from '../../dependency-resolver';
import type {
  PluginPackageContract,
} from '../contracts';

export class PluginDependencyCatalogFactory {
  create(
    installedPackages:
      readonly PluginPackageContract[],
    candidatePackage?: PluginPackageContract,
  ): readonly DependencyResolverCatalogEntry[] {
    const packages = candidatePackage
      ? [...installedPackages, candidatePackage]
      : [...installedPackages];

    const entries = new Map<
      string,
      DependencyResolverCatalogEntry
    >();

    for (const pluginPackage of packages) {
      entries.set(
        pluginPackage.capabilityManifest.id,
        {
          capabilityId:
            pluginPackage.capabilityManifest.id,
          version:
            pluginPackage.capabilityManifest.version,
          manifest:
            pluginPackage.capabilityManifest,
          enabled: true,
          metadata: pluginPackage.metadata,
        },
      );
    }

    return [...entries.values()];
  }
}