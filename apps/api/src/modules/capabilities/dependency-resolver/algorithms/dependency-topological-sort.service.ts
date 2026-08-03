import { Injectable } from '@nestjs/common';

import type { CapabilityIdentifier } from '../../contracts';
import type { DependencyGraphModel } from '../models';
import { DependencyResolverError } from '../errors/dependency-resolver.errors';

@Injectable()
export class DependencyTopologicalSortService {
  sort(
    graph: DependencyGraphModel,
  ): readonly CapabilityIdentifier[] {
    const indegree = new Map<CapabilityIdentifier, number>();

    for (const node of graph.getNodes()) {
      indegree.set(node.capabilityId, 0);
    }

    for (const edge of graph.getEdges()) {
      indegree.set(
        edge.sourceCapabilityId,
        (indegree.get(edge.sourceCapabilityId) ?? 0) + 1,
      );
    }

    const queue: CapabilityIdentifier[] = [
      ...indegree.entries(),
    ]
      .filter(([, degree]) => degree === 0)
      .map(([id]) => id)
      .sort();

    const ordered: CapabilityIdentifier[] = [];

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current) {
        break;
      }

      ordered.push(current);

      for (const dependent of graph.getDependents(current)) {
        const next =
          (indegree.get(dependent.capabilityId) ?? 0) - 1;

        indegree.set(dependent.capabilityId, next);

        if (next === 0) {
          queue.push(dependent.capabilityId);
          queue.sort();
        }
      }
    }

    if (ordered.length !== graph.getNodes().length) {
      throw new DependencyResolverError(
        'Dependency graph contains a circular dependency and cannot be sorted.',
        'DEPENDENCY_TOPOLOGICAL_SORT_FAILED',
      );
    }

    return ordered;
  }
}