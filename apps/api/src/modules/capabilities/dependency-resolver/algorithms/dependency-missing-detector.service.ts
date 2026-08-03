import { Injectable } from '@nestjs/common';

import type {
  CapabilityIdentifier,
  CapabilityManifestContract,
} from '../../contracts';
import type {
  DependencyResolutionIssue,
  DependencyResolverCatalogEntry,
} from '../contracts';

@Injectable()
export class DependencyMissingDetectorService {
  detect(
    rootCapabilityId: CapabilityIdentifier,
    catalog: readonly DependencyResolverCatalogEntry[],
    includeOptional: boolean,
    enforcePeerDependencies: boolean,
  ): readonly DependencyResolutionIssue[] {
    const catalogMap = new Map(
      catalog.map((entry) => [
        entry.capabilityId,
        entry,
      ]),
    );

    const issues: DependencyResolutionIssue[] = [];
    const visited = new Set<CapabilityIdentifier>();

    const inspect = (
      manifest: CapabilityManifestContract,
      path: readonly CapabilityIdentifier[],
    ): void => {
      if (visited.has(manifest.id)) {
        return;
      }

      visited.add(manifest.id);

      for (const dependency of manifest.dependencies) {
        const target = catalogMap.get(
          dependency.capabilityId,
        );

        const required =
          dependency.type === 'required' ||
          (dependency.type === 'peer' &&
            enforcePeerDependencies) ||
          (dependency.type === 'optional' &&
            includeOptional);

        if (!target) {
          if (required) {
            issues.push({
              code: 'DEPENDENCY_MISSING',
              message:
                `Dependency "${dependency.capabilityId}" required by "${manifest.id}" is missing.`,
              capabilityId: manifest.id,
              dependencyId: dependency.capabilityId,
              dependencyType: dependency.type,
              requiredVersionRange:
                dependency.versionRange,
              path: [...path, manifest.id],
            });
          }

          continue;
        }

        inspect(target.manifest, [
          ...path,
          manifest.id,
        ]);
      }
    };

    const root = catalogMap.get(rootCapabilityId);

    if (root) {
      inspect(root.manifest, []);
    }

    return issues;
  }
}