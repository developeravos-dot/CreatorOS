import { Injectable } from '@nestjs/common';

import type { CapabilityIdentifier } from '../../contracts';
import type { DependencyGraphModel } from '../models';

export interface DependencyCycleDetectionResult {
  readonly hasCycle: boolean;
  readonly cycles: readonly (readonly CapabilityIdentifier[])[];
}

@Injectable()
export class DependencyCycleDetectorService {
  detect(
    graph: DependencyGraphModel,
  ): DependencyCycleDetectionResult {
    const visited = new Set<CapabilityIdentifier>();
    const active = new Set<CapabilityIdentifier>();
    const stack: CapabilityIdentifier[] = [];
    const cycles: CapabilityIdentifier[][] = [];

    const visit = (capabilityId: CapabilityIdentifier): void => {
      if (active.has(capabilityId)) {
        const start = stack.indexOf(capabilityId);

        if (start >= 0) {
          cycles.push([
            ...stack.slice(start),
            capabilityId,
          ]);
        }

        return;
      }

      if (visited.has(capabilityId)) {
        return;
      }

      visited.add(capabilityId);
      active.add(capabilityId);
      stack.push(capabilityId);

      for (const dependency of graph.getDependencies(capabilityId)) {
        visit(dependency.capabilityId);
      }

      stack.pop();
      active.delete(capabilityId);
    };

    for (const node of graph.getNodes()) {
      visit(node.capabilityId);
    }

    return {
      hasCycle: cycles.length > 0,
      cycles,
    };
  }
}