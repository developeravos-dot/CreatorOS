import { Injectable } from '@nestjs/common';

import type {
  CapabilityIdentifier,
} from '../../contracts';
import type {
  DependencyGraphBuildRequest,
  DependencyGraphBuilder,
  DependencyResolverCatalogEntry,
} from '../contracts';
import {
  DependencyRootCapabilityNotFoundError,
} from '../errors/dependency-resolver.errors';
import {
  DependencyGraphEdgeModel,
  DependencyGraphModel,
  DependencyGraphNodeModel,
} from '../models';

@Injectable()
export class DependencyGraphBuilderService
  implements DependencyGraphBuilder
{
  build(
    request: DependencyGraphBuildRequest,
  ): DependencyGraphModel {
    const catalogMap = new Map<
      CapabilityIdentifier,
      DependencyResolverCatalogEntry
    >(
      request.catalog.map((entry) => [
        entry.capabilityId,
        entry,
      ]),
    );

    const rootEntry = catalogMap.get(
      request.rootCapabilityId,
    );

    if (!rootEntry) {
      throw new DependencyRootCapabilityNotFoundError(
        request.rootCapabilityId,
      );
    }

    const graph = new DependencyGraphModel();
    const visited = new Set<CapabilityIdentifier>();

    this.addCapabilityRecursively(
      rootEntry,
      catalogMap,
      graph,
      visited,
      request.includeOptional ?? false,
    );

    return graph;
  }

  private addCapabilityRecursively(
    entry: DependencyResolverCatalogEntry,
    catalogMap: ReadonlyMap<
      CapabilityIdentifier,
      DependencyResolverCatalogEntry
    >,
    graph: DependencyGraphModel,
    visited: Set<CapabilityIdentifier>,
    includeOptional: boolean,
  ): void {
    if (visited.has(entry.capabilityId)) {
      return;
    }

    visited.add(entry.capabilityId);

    if (!graph.hasNode(entry.capabilityId)) {
      graph.addNode(
        new DependencyGraphNodeModel(
          entry.capabilityId,
          entry.version,
          entry.manifest,
          entry.enabled ?? true,
          entry.metadata,
        ),
      );
    }

    for (const dependency of entry.manifest.dependencies) {
      if (
        dependency.type === 'optional' &&
        !includeOptional
      ) {
        continue;
      }

      const targetEntry = catalogMap.get(
        dependency.capabilityId,
      );

      if (!targetEntry) {
        continue;
      }

      this.addCapabilityRecursively(
        targetEntry,
        catalogMap,
        graph,
        visited,
        includeOptional,
      );

      graph.addEdge(
        new DependencyGraphEdgeModel(
          entry.capabilityId,
          dependency.capabilityId,
          dependency.type,
          dependency.versionRange,
          'unresolved',
          dependency.reason,
          dependency.metadata,
        ),
      );
    }
  }
}