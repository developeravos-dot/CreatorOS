import {
  Injectable,
} from '@nestjs/common';

import type {
  CapabilityMetadata,
} from '../../contracts';
import type {
  DependencyResolutionStatus,
  DependencyResolverCatalogEntry,
} from '../../dependency-resolver';
import type {
  BulkDependencyAnalysisResult,
  DependencyAnalysisSummary,
} from '../contracts';
import type {
  BulkDependencyAnalysisDto,
  ResolveCapabilityDependenciesDto,
} from '../dto';
import {
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';
import {
  CapabilityPlatformService,
} from './capability-platform.service';

@Injectable()
export class CapabilityDependencyManagementService {
  constructor(
    private readonly platform:
      CapabilityPlatformService,
    private readonly audit:
      CapabilityPlatformAuditService,
  ) {}

  resolve(
    input:
      ResolveCapabilityDependenciesDto,
  ) {
    try {
      const result =
        this.platform.dependencyResolver.resolve(
          this.toRequest(input),
        );

      this.recordSuccess(
        'dependencies.resolved',
        input.rootCapabilityId,
        {
          status:
            result.status,
          orderedCapabilities:
            result.orderedCapabilityIds.length,
          issues:
            result.issues.length,
        },
        input.actorId,
        input.correlationId,
      );

      return result;
    } catch (error) {
      this.recordFailure(
        'dependencies.resolved',
        input.rootCapabilityId,
        error,
        input.actorId,
        input.correlationId,
      );

      throw error;
    }
  }

  createPlan(
    input:
      ResolveCapabilityDependenciesDto,
  ) {
    try {
      const plan =
        this.platform.dependencyResolver
          .createPlan(
            this.toRequest(input),
          );

      this.recordSuccess(
        'dependencies.plan-created',
        input.rootCapabilityId,
        {
          executable:
            plan.executable,
          orderedCapabilities:
            plan.orderedCapabilityIds
              .length,
          steps:
            plan.steps.length,
          issues:
            plan.issues.length,
        },
        input.actorId,
        input.correlationId,
      );

      return plan;
    } catch (error) {
      this.recordFailure(
        'dependencies.plan-created',
        input.rootCapabilityId,
        error,
        input.actorId,
        input.correlationId,
      );

      throw error;
    }
  }

  summarize(
    input:
      ResolveCapabilityDependenciesDto,
  ): DependencyAnalysisSummary {
    try {
      const resolution =
        this.platform.dependencyResolver.resolve(
          this.toRequest(input),
        );

      const plan =
        this.platform.dependencyResolver
          .createPlan(
            this.toRequest(input),
          );

      const countIssue = (
        code: string,
      ) =>
        resolution.issues.filter(
          (issue) =>
            issue.code === code,
        ).length;

      const result:
        DependencyAnalysisSummary = {
          rootCapabilityId:
            input.rootCapabilityId,
          status:
            resolution.status,
          executable:
            plan.executable,
          orderedCapabilities:
            resolution
              .orderedCapabilityIds
              .length,
          totalIssues:
            resolution.issues.length,
          missingDependencies:
            countIssue(
              'DEPENDENCY_MISSING',
            ),
          optionalMissingDependencies:
            countIssue(
              'DEPENDENCY_OPTIONAL_MISSING',
            ),
          incompatibleVersions:
            countIssue(
              'DEPENDENCY_VERSION_INCOMPATIBLE',
            ),
          circularDependencies:
            countIssue(
              'DEPENDENCY_CIRCULAR',
            ),
          generatedAt:
            new Date().toISOString(),
        };

      this.recordSuccess(
        'management.dependencies-summary-read',
        input.rootCapabilityId,
        {
          status:
            result.status,
          executable:
            result.executable,
          totalIssues:
            result.totalIssues,
        },
        input.actorId,
        input.correlationId,
      );

      return result;
    } catch (error) {
      this.recordFailure(
        'management.dependencies-summary-read',
        input.rootCapabilityId,
        error,
        input.actorId,
        input.correlationId,
      );

      throw error;
    }
  }

  bulkAnalyze(
    input:
      BulkDependencyAnalysisDto,
  ): BulkDependencyAnalysisResult {
    const results:
      {
        rootCapabilityId: string;
        successful: boolean;
        status?:
          DependencyResolutionStatus;
        executable?: boolean;
        orderedCapabilityIds?:
          readonly string[];
        issues?: readonly unknown[];
        error?: string;
      }[] = [];

    for (
      const request
      of input.requests
    ) {
      try {
        const normalizedInput:
          ResolveCapabilityDependenciesDto = {
            rootCapabilityId:
              request.rootCapabilityId,
            catalog:
              input.catalog,
            includeOptional:
              request.includeOptional,
            enforcePeerDependencies:
              request
                .enforcePeerDependencies,
            metadata:
              input.metadata,
            actorId:
              input.actorId,
            correlationId:
              input.correlationId,
          };

        const resolution =
          this.platform.dependencyResolver
            .resolve(
              this.toRequest(
                normalizedInput,
              ),
            );

        const plan =
          this.platform.dependencyResolver
            .createPlan(
              this.toRequest(
                normalizedInput,
              ),
            );

        results.push({
          rootCapabilityId:
            request.rootCapabilityId,
          successful: true,
          status:
            resolution.status,
          executable:
            plan.executable,
          orderedCapabilityIds:
            resolution
              .orderedCapabilityIds,
          issues:
            resolution.issues,
        });

        this.recordSuccess(
          'dependencies.bulk-analysis-item',
          request.rootCapabilityId,
          {
            status:
              resolution.status,
            executable:
              plan.executable,
          },
          input.actorId,
          input.correlationId,
        );
      } catch (error) {
        results.push({
          rootCapabilityId:
            request.rootCapabilityId,
          successful: false,
          error:
            this.errorMessage(
              error,
            ),
        });

        this.recordFailure(
          'dependencies.bulk-analysis-item',
          request.rootCapabilityId,
          error,
          input.actorId,
          input.correlationId,
          {
            bulk: true,
          },
        );

        if (
          input.continueOnError ===
          false
        ) {
          break;
        }
      }
    }

    const succeeded =
      results.filter(
        (item) =>
          item.successful,
      ).length;

    const result:
      BulkDependencyAnalysisResult = {
        requested:
          input.requests.length,
        succeeded,
        failed:
          input.requests.length -
          succeeded,
        resolved:
          results.filter(
            (item) =>
              item.status ===
              'resolved',
          ).length,
        incompatible:
          results.filter(
            (item) =>
              item.status ===
              'incompatible',
          ).length,
        circular:
          results.filter(
            (item) =>
              item.status ===
              'circular',
          ).length,
        pending:
          results.filter(
            (item) =>
              item.status ===
              'pending',
          ).length,
        results,
        completedAt:
          new Date().toISOString(),
      };

    this.recordSuccess(
      'dependencies.bulk-analysis-completed',
      'dependency-resolver',
      {
        requested:
          result.requested,
        succeeded:
          result.succeeded,
        failed:
          result.failed,
      },
      input.actorId,
      input.correlationId,
    );

    return result;
  }

  private toRequest(
    input:
      ResolveCapabilityDependenciesDto,
  ) {
    return {
      rootCapabilityId:
        input.rootCapabilityId,
      catalog:
        input.catalog as unknown as
          readonly DependencyResolverCatalogEntry[],
      includeOptional:
        input.includeOptional,
      enforcePeerDependencies:
        input.enforcePeerDependencies,
      metadata:
        input.metadata as
          | CapabilityMetadata
          | undefined,
    };
  }

  private recordSuccess(
    operation:
      | `dependencies.${string}`
      | `management.${string}`,
    subjectId: string,
    metadata:
      Readonly<Record<string, unknown>> =
        {},
    actorId?: string,
    correlationId?: string,
  ): void {
    this.audit.record({
      operation,
      successful: true,
      subjectId,
      actorId,
      correlationId,
      metadata,
    });
  }

  private recordFailure(
    requestedOperation: string,
    subjectId: string,
    error: unknown,
    actorId?: string,
    correlationId?: string,
    metadata:
      Readonly<Record<string, unknown>> =
        {},
  ): void {
    this.audit.record({
      operation:
        'operation.failed',
      successful: false,
      subjectId,
      actorId,
      correlationId,
      message:
        this.errorMessage(
          error,
        ),
      metadata: {
        requestedOperation,
        ...metadata,
      },
    });
  }

  private errorMessage(
    error: unknown,
  ): string {
    return error instanceof Error
      ? error.message
      : String(error);
  }
}