import { Injectable } from '@nestjs/common';

import type {
  CapabilityIdentifier,
} from '../../contracts';
import type {
  DependencyResolutionIssue,
  DependencyResolutionRequest,
  DependencyResolutionResult,
  DependencyResolverCatalogEntry,
} from '../contracts';
import {
  DependencyCycleDetectorService,
  DependencyMissingDetectorService,
  DependencyTopologicalSortService,
} from '../algorithms';
import {
  DependencyGraphBuilderService,
} from '../graph';
import {
  DependencyResolutionPlanBuilderService,
  type DependencyResolutionPlanModel,
} from '../planning';
import {
  DependencyVersionResolverService,
} from '../versioning';

@Injectable()
export class DependencyResolverEngineService {
  private readonly graphBuilder:
    DependencyGraphBuilderService;

  private readonly missingDetector:
    DependencyMissingDetectorService;

  private readonly cycleDetector:
    DependencyCycleDetectorService;

  private readonly topologicalSort:
    DependencyTopologicalSortService;

  private readonly versionResolver:
    DependencyVersionResolverService;

  private readonly planBuilder:
    DependencyResolutionPlanBuilderService;

  constructor() {
    this.graphBuilder =
      new DependencyGraphBuilderService();

    this.missingDetector =
      new DependencyMissingDetectorService();

    this.cycleDetector =
      new DependencyCycleDetectorService();

    this.topologicalSort =
      new DependencyTopologicalSortService();

    this.versionResolver =
      new DependencyVersionResolverService();

    this.planBuilder =
      new DependencyResolutionPlanBuilderService();
  }

  resolve(
    request: DependencyResolutionRequest,
  ): DependencyResolutionResult {
    const includeOptional =
      request.includeOptional ?? false;

    const enforcePeerDependencies =
      request.enforcePeerDependencies ?? true;

    const issues: DependencyResolutionIssue[] = [
      ...this.missingDetector.detect(
        request.rootCapabilityId,
        request.catalog,
        includeOptional,
        enforcePeerDependencies,
      ),
    ];

    const graph = this.graphBuilder.build({
      rootCapabilityId: request.rootCapabilityId,
      catalog: request.catalog,
      includeOptional,
    });

    issues.push(
      ...this.detectVersionIssues(
        graph.getNodes().map((node) => ({
          capabilityId: node.capabilityId,
          version: node.version,
          manifest: node.manifest,
          enabled: node.enabled,
          metadata: node.metadata,
        })),
      ),
    );

    const cycleResult =
      this.cycleDetector.detect(graph);

    for (const cycle of cycleResult.cycles) {
      issues.push({
        code: 'DEPENDENCY_CIRCULAR',
        message:
          `Circular dependency detected: ${cycle.join(' -> ')}.`,
        capabilityId:
          cycle[0] ?? request.rootCapabilityId,
        path: cycle,
      });
    }

    let orderedCapabilityIds:
      readonly CapabilityIdentifier[] = [];

    if (!cycleResult.hasCycle) {
      orderedCapabilityIds =
        this.topologicalSort.sort(graph);
    }

    const hasErrors = issues.some(
      (issue) =>
        issue.code !==
        'DEPENDENCY_OPTIONAL_MISSING',
    );

    return {
      rootCapabilityId:
        request.rootCapabilityId,
      status: cycleResult.hasCycle
        ? 'circular'
        : hasErrors
          ? 'incompatible'
          : 'resolved',
      orderedCapabilityIds,
      issues,
      resolvedAt: new Date().toISOString(),
    };
  }

  createPlan(
    request: DependencyResolutionRequest,
  ): DependencyResolutionPlanModel {
    const result = this.resolve(request);

    const graph = this.graphBuilder.build({
      rootCapabilityId:
        request.rootCapabilityId,
      catalog: request.catalog,
      includeOptional:
        request.includeOptional ?? false,
    });

    return this.planBuilder.build(
      request.rootCapabilityId,
      graph,
      result.orderedCapabilityIds,
      result.issues,
    );
  }

  private detectVersionIssues(
    catalog: readonly DependencyResolverCatalogEntry[],
  ): readonly DependencyResolutionIssue[] {
    const catalogMap = new Map(
      catalog.map((entry) => [
        entry.capabilityId,
        entry,
      ]),
    );

    const issues: DependencyResolutionIssue[] = [];

    for (const entry of catalog) {
      for (const dependency of entry.manifest.dependencies) {
        const target = catalogMap.get(
          dependency.capabilityId,
        );

        if (!target) {
          continue;
        }

        if (
          !this.versionResolver.satisfies(
            target.version,
            dependency.versionRange,
          )
        ) {
          issues.push({
            code:
              'DEPENDENCY_VERSION_INCOMPATIBLE',
            message:
              `Capability "${entry.capabilityId}" requires "${dependency.capabilityId}" ${dependency.versionRange}, but ${target.version} is available.`,
            capabilityId:
              entry.capabilityId,
            dependencyId:
              dependency.capabilityId,
            dependencyType:
              dependency.type,
            requiredVersionRange:
              dependency.versionRange,
            availableVersion:
              target.version,
          });
        }
      }
    }

    return issues;
  }
}
