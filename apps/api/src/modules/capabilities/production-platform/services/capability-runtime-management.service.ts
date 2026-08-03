import {
  Injectable,
} from '@nestjs/common';

import type {
  CapabilityMetadata,
} from '../../contracts';
import type {
  BulkRuntimeStopResult,
  RuntimeManagementListResult,
  RuntimeManagementMetrics,
  RuntimeRestartResult,
} from '../contracts';
import type {
  BulkRuntimeInstanceIdsDto,
  RestartManagedRuntimeDto,
  RuntimeManagementListQueryDto,
  StartManagedRuntimeDto,
  StopManagedRuntimeDto,
} from '../dto';
import {
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';
import {
  CapabilityPlatformService,
} from './capability-platform.service';

@Injectable()
export class CapabilityRuntimeManagementService {
  constructor(
    private readonly platform:
      CapabilityPlatformService,
    private readonly audit:
      CapabilityPlatformAuditService,
  ) {}

  list(
    query:
      RuntimeManagementListQueryDto = {},
  ): RuntimeManagementListResult {
    const instances =
      this.platform.runtime.listInstances();

    const capabilityId =
      query.capabilityId
        ?.trim()
        .toLowerCase();

    const status =
      query.status
        ?.trim()
        .toLowerCase();

    const lifecycleState =
      query.lifecycleState
        ?.trim()
        .toLowerCase();

    const filtered =
      instances.filter((instance) => {
        if (
          capabilityId &&
          instance.capabilityId
            .toLowerCase() !==
            capabilityId
        ) {
          return false;
        }

        if (
          status &&
          instance.status
            .toLowerCase() !==
            status
        ) {
          return false;
        }

        if (
          lifecycleState &&
          instance.lifecycleState
            .toLowerCase() !==
            lifecycleState
        ) {
          return false;
        }

        return true;
      });

    const page =
      Math.max(
        1,
        query.page ?? 1,
      );

    const pageSize =
      Math.max(
        1,
        Math.min(
          200,
          query.pageSize ?? 25,
        ),
      );

    const totalItems =
      filtered.length;

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          totalItems / pageSize,
        ),
      );

    const safePage =
      Math.min(
        page,
        totalPages,
      );

    const offset =
      (safePage - 1) *
      pageSize;

    const pageInstances =
      filtered.slice(
        offset,
        offset + pageSize,
      );

    this.audit.record({
      operation:
        'management.runtime-instances-read',
      successful: true,
      subjectId:
        'capability-runtime',
      metadata: {
        totalItems,
        returnedItems:
          pageInstances.length,
        page:
          safePage,
        pageSize,
      },
    });

    return {
      count:
        pageInstances.length,
      total:
        totalItems,
      pagination: {
        page:
          safePage,
        pageSize,
        totalItems,
        totalPages,
        hasPreviousPage:
          safePage > 1,
        hasNextPage:
          safePage < totalPages,
      },
      instances:
        pageInstances,
    };
  }

  getInstance(
    instanceId: string,
  ) {
    try {
      const instance =
        this.platform.runtime.getInstance(
          instanceId,
        );

      this.recordSuccess(
        'management.runtime-instance-read',
        instanceId,
      );

      return instance;
    } catch (error) {
      this.recordFailure(
        'management.runtime-instance-read',
        instanceId,
        error,
      );

      throw error;
    }
  }

  async start(
    input:
      StartManagedRuntimeDto,
  ) {
    try {
      const result =
        await this.platform.runtime.start({
          capabilityId:
            input.capabilityId,
          actorId:
            input.actorId,
          correlationId:
            input.correlationId,
          metadata:
            input.metadata as
              | CapabilityMetadata
              | undefined,
        });

      this.recordSuccess(
        'runtime.started',
        result.instanceId,
        {
          capabilityId:
            result.capabilityId,
        },
        input.actorId,
        input.correlationId,
      );

      return result;
    } catch (error) {
      this.recordFailure(
        'runtime.started',
        input.capabilityId,
        error,
        input.actorId,
        input.correlationId,
      );

      throw error;
    }
  }

  async stop(
    instanceId: string,
    input:
      StopManagedRuntimeDto = {},
  ) {
    try {
      const result =
        await this.platform.runtime.stop({
          instanceId,
          reason:
            input.reason,
          actorId:
            input.actorId,
          correlationId:
            input.correlationId,
        });

      this.recordSuccess(
        'runtime.stopped',
        instanceId,
        {
          capabilityId:
            result.capabilityId,
        },
        input.actorId,
        input.correlationId,
      );

      return result;
    } catch (error) {
      this.recordFailure(
        'runtime.stopped',
        instanceId,
        error,
        input.actorId,
        input.correlationId,
      );

      throw error;
    }
  }

  async restart(
    instanceId: string,
    input:
      RestartManagedRuntimeDto = {},
  ): Promise<RuntimeRestartResult> {
    try {
      const existing =
        this.platform.runtime.getInstance(
          instanceId,
        );

      const capabilityId =
        existing.capabilityId;

      const stopResult =
        await this.platform.runtime.stop({
          instanceId,
          reason:
            input.reason ??
            'Runtime restart requested.',
          actorId:
            input.actorId,
          correlationId:
            input.correlationId,
        });

      const startResult =
        await this.platform.runtime.start({
          capabilityId,
          actorId:
            input.actorId,
          correlationId:
            input.correlationId,
          metadata:
            input.metadata as
              | CapabilityMetadata
              | undefined,
        });

      const result:
        RuntimeRestartResult = {
          previousInstanceId:
            instanceId,
          newInstanceId:
            startResult.instanceId,
          capabilityId,
          stopResult,
          startResult,
          restartedAt:
            new Date().toISOString(),
        };

      this.recordSuccess(
        'runtime.restarted',
        instanceId,
        {
          capabilityId,
          newInstanceId:
            startResult.instanceId,
        },
        input.actorId,
        input.correlationId,
      );

      return result;
    } catch (error) {
      this.recordFailure(
        'runtime.restarted',
        instanceId,
        error,
        input.actorId,
        input.correlationId,
      );

      throw error;
    }
  }

  async health(
    instanceId: string,
  ) {
    try {
      const result =
        await this.platform.runtime.healthCheck(
          instanceId,
        );

      this.recordSuccess(
        'management.runtime-health-read',
        instanceId,
        {
          status:
            result.report.status,
          capabilityId:
            result.capabilityId,
        },
      );

      return result;
    } catch (error) {
      this.recordFailure(
        'management.runtime-health-read',
        instanceId,
        error,
      );

      throw error;
    }
  }

  metrics():
    RuntimeManagementMetrics {
    const instances =
      this.platform.runtime.listInstances();

    const countStatus = (
      target: string,
    ) =>
      instances.filter(
        (instance) =>
          instance.status === target,
      ).length;

    const result:
      RuntimeManagementMetrics = {
        totalInstances:
          instances.length,
        createdInstances:
          countStatus('created'),
        initializingInstances:
          countStatus('initializing'),
        runningInstances:
          countStatus('running'),
        stoppingInstances:
          countStatus('stopping'),
        stoppedInstances:
          countStatus('stopped'),
        failedInstances:
          countStatus('failed'),
        uniqueCapabilities:
          new Set(
            instances.map(
              (instance) =>
                instance.capabilityId,
            ),
          ).size,
        generatedAt:
          new Date().toISOString(),
      };

    this.recordSuccess(
      'management.runtime-metrics-read',
      'capability-runtime',
      {
        totalInstances:
          result.totalInstances,
      },
    );

    return result;
  }

  async bulkStop(
    input:
      BulkRuntimeInstanceIdsDto,
  ): Promise<
    BulkRuntimeStopResult
  > {
    const uniqueIds = [
      ...new Set(
        input.instanceIds,
      ),
    ];

    const results:
      {
        instanceId: string;
        successful: boolean;
        result?: Awaited<
          ReturnType<
            CapabilityPlatformService[
              'runtime'
            ]['stop']
          >
        >;
        error?: string;
      }[] = [];

    for (
      const instanceId
      of uniqueIds
    ) {
      try {
        const result =
          await this.platform.runtime.stop({
            instanceId,
            reason:
              input.reason,
            actorId:
              input.actorId,
            correlationId:
              input.correlationId,
          });

        results.push({
          instanceId,
          successful: true,
          result,
        });

        this.recordSuccess(
          'runtime.stopped',
          instanceId,
          {
            bulk: true,
            capabilityId:
              result.capabilityId,
          },
          input.actorId,
          input.correlationId,
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : String(error);

        results.push({
          instanceId,
          successful: false,
          error:
            message,
        });

        this.recordFailure(
          'runtime.stopped',
          instanceId,
          error,
          input.actorId,
          input.correlationId,
          {
            bulk: true,
          },
        );
      }
    }

    const succeeded =
      results.filter(
        (item) =>
          item.successful,
      ).length;

    return {
      requested:
        uniqueIds.length,
      succeeded,
      failed:
        uniqueIds.length -
        succeeded,
      results,
      completedAt:
        new Date().toISOString(),
    };
  }

  private recordSuccess(
    operation: string,
    subjectId: string,
    metadata:
      Readonly<Record<string, unknown>> =
        {},
    actorId?: string,
    correlationId?: string,
  ): void {
    this.audit.record({
      operation:
        operation as
          `runtime.${string}` |
          `management.${string}`,
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
        error instanceof Error
          ? error.message
          : String(error),
      metadata: {
        requestedOperation,
        ...metadata,
      },
    });
  }
}