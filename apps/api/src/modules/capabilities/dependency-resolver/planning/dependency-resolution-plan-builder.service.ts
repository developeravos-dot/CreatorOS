import { Injectable } from '@nestjs/common';

import type { DependencyGraphModel } from '../models';
import type {
  DependencyResolutionIssue,
} from '../contracts';
import {
  DependencyResolutionPlanModel,
  type DependencyResolutionPlanStep,
} from './dependency-resolution-plan.model';

@Injectable()
export class DependencyResolutionPlanBuilderService {
  build(
    rootCapabilityId: string,
    graph: DependencyGraphModel,
    orderedCapabilityIds: readonly string[],
    issues: readonly DependencyResolutionIssue[],
  ): DependencyResolutionPlanModel {
    const steps: DependencyResolutionPlanStep[] = [];

    for (const capabilityId of orderedCapabilityIds) {
      const dependsOn = graph
        .getDependencies(capabilityId)
        .map((dependency) =>
          dependency.capabilityId,
        );

      for (const type of [
        'validate',
        'install',
        'initialize',
        'activate',
      ] as const) {
        steps.push({
          sequence: steps.length + 1,
          capabilityId,
          type,
          dependsOn,
        });
      }
    }

    return new DependencyResolutionPlanModel(
      rootCapabilityId,
      orderedCapabilityIds,
      steps,
      issues,
    );
  }
}