import {
  Injectable,
} from '@nestjs/common';

import type {
  JobExecutionListQueryContract,
  JobExecutionListResultContract,
  JobListQueryContract,
  JobListResultContract,
  JobQueueListQueryContract,
  JobQueueListResultContract,
  JobScheduleListQueryContract,
  JobScheduleListResultContract,
  PaginationContract,
} from '../contracts';
import {
  JOB_PRIORITY_RANK,
  type Job,
  type JobExecution,
  type JobPriority,
  type JobQueue,
  type JobSchedule,
} from '../models';
import {
  JobEngineService,
} from './job-engine.service';
import {
  JobQueueFactoryService,
} from './job-queue-factory.service';
import {
  JobSchedulerService,
} from './job-scheduler.service';

@Injectable()
export class JobQueryService {
  constructor(
    private readonly jobEngine:
      JobEngineService,
    private readonly scheduler:
      JobSchedulerService,
    private readonly queueFactory:
      JobQueueFactoryService,
  ) {}

  searchJobs(
    query:
      JobListQueryContract = {},
  ): JobListResultContract {
    const filtered =
      this.filterJobs(
        this.jobEngine.list(),
        query,
      );

    const sorted =
      this.sortJobs(
        filtered,
        query.sortBy ??
          'createdAt',
        query.sortDirection ??
          'desc',
      );

    const pageResult =
      this.paginate(
        sorted,
        query.page,
        query.pageSize,
      );

    return {
      count:
        pageResult.items.length,
      total:
        pageResult.pagination
          .totalItems,
      pagination:
        pageResult.pagination,
      jobs:
        pageResult.items.map(
          (job) =>
            this.cloneJob(job),
        ),
    };
  }

  searchExecutions(
    query:
      JobExecutionListQueryContract = {},
  ): JobExecutionListResultContract {
    const filtered =
      this.filterExecutions(
        this.jobEngine
          .listExecutions(),
        query,
      );

    const sorted =
      this.sortExecutions(
        filtered,
        query.sortBy ??
          'createdAt',
        query.sortDirection ??
          'desc',
      );

    const pageResult =
      this.paginate(
        sorted,
        query.page,
        query.pageSize,
      );

    return {
      count:
        pageResult.items.length,
      total:
        pageResult.pagination
          .totalItems,
      pagination:
        pageResult.pagination,
      executions:
        pageResult.items.map(
          (execution) =>
            this.cloneExecution(
              execution,
            ),
        ),
    };
  }

  searchSchedules(
    query:
      JobScheduleListQueryContract = {},
  ): JobScheduleListResultContract {
    const filtered =
      this.filterSchedules(
        this.scheduler.list(),
        query,
      );

    const sorted =
      this.sortSchedules(
        filtered,
        query.sortBy ??
          'createdAt',
        query.sortDirection ??
          'desc',
      );

    const pageResult =
      this.paginate(
        sorted,
        query.page,
        query.pageSize,
      );

    return {
      count:
        pageResult.items.length,
      total:
        pageResult.pagination
          .totalItems,
      pagination:
        pageResult.pagination,
      schedules:
        pageResult.items.map(
          (schedule) => ({
            ...schedule,
            definition: {
              ...schedule.definition,
            },
          }),
        ),
    };
  }

  searchQueues(
    query:
      JobQueueListQueryContract = {},
  ): JobQueueListResultContract {
    const queues =
      this.queueFactory
        .list()
        .map(
          (adapter): JobQueue => {
            const configuration =
              adapter
                .getConfiguration();

            const metrics =
              adapter.metrics();

            const now =
              metrics.generatedAt;

            return {
              name:
                adapter.name,
              configuration,
              metrics,
              createdAt: now,
              updatedAt: now,
            };
          },
        );

    const filtered =
      this.filterQueues(
        queues,
        query,
      );

    const sorted =
      this.sortQueues(
        filtered,
        query.sortBy ??
          'name',
        query.sortDirection ??
          'asc',
      );

    const pageResult =
      this.paginate(
        sorted,
        query.page,
        query.pageSize,
      );

    return {
      count:
        pageResult.items.length,
      total:
        pageResult.pagination
          .totalItems,
      pagination:
        pageResult.pagination,
      queues:
        pageResult.items.map(
          (queue) => ({
            ...queue,
            configuration: {
              ...queue.configuration,
            },
            metrics: {
              ...queue.metrics,
            },
          }),
        ),
    };
  }

  findDelayedJobs():
    readonly Job[] {
    return this.searchJobs({
      states: [
        'delayed',
      ],
      pageSize: 500,
    }).jobs;
  }

  findFailedJobs():
    readonly Job[] {
    return this.searchJobs({
      states: [
        'failed',
        'dead_lettered',
      ],
      pageSize: 500,
    }).jobs;
  }

  findPendingRetries():
    readonly Job[] {
    return this.searchJobs({
      states: [
        'retry_scheduled',
      ],
      pageSize: 500,
    }).jobs;
  }

  findRunningJobs():
    readonly Job[] {
    return this.searchJobs({
      states: [
        'running',
      ],
      pageSize: 500,
    }).jobs;
  }

  findScheduledJobs():
    readonly Job[] {
    return this.searchJobs({
      states: [
        'scheduled',
      ],
      pageSize: 500,
    }).jobs;
  }

  findExecutionsByWorker(
    workerId: string,
  ): readonly JobExecution[] {
    return this.searchExecutions({
      workerIds: [
        workerId,
      ],
      pageSize: 500,
    }).executions;
  }

  private filterJobs(
    jobs:
      readonly Job[],
    query:
      JobListQueryContract,
  ): readonly Job[] {
    const search =
      query.search
        ?.trim()
        .toLowerCase();

    const ids =
      new Set(
        query.ids ?? [],
      );

    const states =
      new Set(
        query.states ?? [],
      );

    const priorities =
      new Set(
        query.priorities ?? [],
      );

    const types =
      new Set(
        query.types ?? [],
      );

    const queueNames =
      new Set(
        (query.queueNames ?? [])
          .map(
            (name) =>
              name.toLowerCase(),
          ),
      );

    const ownerIds =
      new Set(
        query.ownerIds ?? [],
      );

    const requiredTags =
      (query.tags ?? [])
        .map(
          (tag) =>
            tag
              .trim()
              .toLowerCase(),
        )
        .filter(Boolean);

    return jobs.filter(
      (job) => {
        if (
          ids.size > 0 &&
          !ids.has(job.id)
        ) {
          return false;
        }

        if (
          states.size > 0 &&
          !states.has(
            job.state,
          )
        ) {
          return false;
        }

        if (
          priorities.size > 0 &&
          !priorities.has(
            job.priority,
          )
        ) {
          return false;
        }

        if (
          types.size > 0 &&
          !types.has(job.type)
        ) {
          return false;
        }

        if (
          queueNames.size > 0 &&
          !queueNames.has(
            job.queueName
              .toLowerCase(),
          )
        ) {
          return false;
        }

        if (
          ownerIds.size > 0 &&
          (
            !job.ownership
              .createdBy ||
            !ownerIds.has(
              job.ownership
                .createdBy,
            )
          )
        ) {
          return false;
        }

        if (
          query.tenantId &&
          job.ownership.tenantId !==
            query.tenantId
        ) {
          return false;
        }

        if (
          query.workspaceId &&
          job.ownership
            .workspaceId !==
            query.workspaceId
        ) {
          return false;
        }

        if (
          query.correlationId &&
          job.correlation
            .correlationId !==
            query.correlationId
        ) {
          return false;
        }

        if (
          query.traceId &&
          job.correlation.traceId !==
            query.traceId
        ) {
          return false;
        }

        if (
          requiredTags.length > 0 &&
          !requiredTags.every(
            (tag) =>
              job.tags.tags
                .includes(tag),
          )
        ) {
          return false;
        }

        if (
          query.enabled !==
            undefined &&
          job.configuration
            .enabled !==
            query.enabled
        ) {
          return false;
        }

        if (
          query.hasFailure !==
            undefined &&
          Boolean(job.failure) !==
            query.hasFailure
        ) {
          return false;
        }

        if (
          query
            .hasActiveExecution !==
            undefined
        ) {
          const hasActive =
            Boolean(
              job.currentExecutionId,
            ) &&
            (
              job.state ===
                'queued' ||
              job.state ===
                'waiting' ||
              job.state ===
                'delayed' ||
              job.state ===
                'running' ||
              job.state ===
                'retry_scheduled'
            );

          if (
            hasActive !==
            query
              .hasActiveExecution
          ) {
            return false;
          }
        }

        if (
          !this.dateInRange(
            job.createdAt,
            query.createdFrom,
            query.createdTo,
          )
        ) {
          return false;
        }

        if (
          !this.dateInRange(
            job.updatedAt,
            query.updatedFrom,
            query.updatedTo,
          )
        ) {
          return false;
        }

        if (
          query.scheduledBefore &&
          (
            !job.nextExecutionAt ||
            new Date(
              job.nextExecutionAt,
            ).getTime() >
              new Date(
                query
                  .scheduledBefore,
              ).getTime()
          )
        ) {
          return false;
        }

        if (
          query.scheduledAfter &&
          (
            !job.nextExecutionAt ||
            new Date(
              job.nextExecutionAt,
            ).getTime() <
              new Date(
                query
                  .scheduledAfter,
              ).getTime()
          )
        ) {
          return false;
        }

        if (search) {
          const searchable =
            [
              job.id,
              job.name,
              job.description,
              job.type,
              job.state,
              job.priority,
              job.queueName,
              job.correlation
                .correlationId,
              job.correlation
                .traceId,
              job.ownership
                .createdBy,
              job.ownership
                .tenantId,
              job.ownership
                .workspaceId,
              ...job.tags.tags,
              ...Object.keys(
                job.tags.labels,
              ),
              ...Object.values(
                job.tags.labels,
              ),
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

          if (
            !searchable.includes(
              search,
            )
          ) {
            return false;
          }
        }

        return true;
      },
    );
  }

  private filterExecutions(
    executions:
      readonly JobExecution[],
    query:
      JobExecutionListQueryContract,
  ): readonly JobExecution[] {
    const executionIds =
      new Set(
        query.executionIds ?? [],
      );

    const states =
      new Set(
        query.states ?? [],
      );

    const outcomes =
      new Set(
        query.outcomes ?? [],
      );

    const queueNames =
      new Set(
        query.queueNames ?? [],
      );

    const workerIds =
      new Set(
        query.workerIds ?? [],
      );

    return executions.filter(
      (execution) => {
        if (
          query.jobId &&
          execution.jobId !==
            query.jobId
        ) {
          return false;
        }

        if (
          executionIds.size > 0 &&
          !executionIds.has(
            execution.id,
          )
        ) {
          return false;
        }

        if (
          states.size > 0 &&
          !states.has(
            execution.state,
          )
        ) {
          return false;
        }

        if (
          outcomes.size > 0 &&
          (
            !execution.outcome ||
            !outcomes.has(
              execution.outcome,
            )
          )
        ) {
          return false;
        }

        if (
          queueNames.size > 0 &&
          !queueNames.has(
            execution.queueName,
          )
        ) {
          return false;
        }

        if (
          workerIds.size > 0 &&
          (
            !execution.lease
              ?.workerId ||
            !workerIds.has(
              execution.lease
                .workerId,
            )
          )
        ) {
          return false;
        }

        if (
          query.attemptFrom !==
            undefined &&
          execution.attemptNumber <
            query.attemptFrom
        ) {
          return false;
        }

        if (
          query.attemptTo !==
            undefined &&
          execution.attemptNumber >
            query.attemptTo
        ) {
          return false;
        }

        if (
          !this.optionalDateInRange(
            execution.timing
              .startedAt,
            query.startedFrom,
            query.startedTo,
          )
        ) {
          return false;
        }

        if (
          !this.optionalDateInRange(
            execution.timing
              .finishedAt,
            query.finishedFrom,
            query.finishedTo,
          )
        ) {
          return false;
        }

        return true;
      },
    );
  }

  private filterSchedules(
    schedules:
      readonly JobSchedule[],
    query:
      JobScheduleListQueryContract,
  ): readonly JobSchedule[] {
    const scheduleIds =
      new Set(
        query.scheduleIds ?? [],
      );

    const kinds =
      new Set(
        query.kinds ?? [],
      );

    return schedules.filter(
      (schedule) => {
        if (
          query.jobId &&
          schedule.jobId !==
            query.jobId
        ) {
          return false;
        }

        if (
          scheduleIds.size > 0 &&
          !scheduleIds.has(
            schedule.id,
          )
        ) {
          return false;
        }

        if (
          kinds.size > 0 &&
          !kinds.has(
            schedule.definition
              .kind,
          )
        ) {
          return false;
        }

        if (
          query.enabled !==
            undefined &&
          schedule.enabled !==
            query.enabled
        ) {
          return false;
        }

        if (
          !this.optionalDateInRange(
            schedule.nextRunAt,
            query.nextRunFrom,
            query.nextRunTo,
          )
        ) {
          return false;
        }

        return true;
      },
    );
  }

  private filterQueues(
    queues:
      readonly JobQueue[],
    query:
      JobQueueListQueryContract,
  ): readonly JobQueue[] {
    const search =
      query.search
        ?.trim()
        .toLowerCase();

    const names =
      new Set(
        query.names ?? [],
      );

    const drivers =
      new Set(
        query.drivers ?? [],
      );

    return queues.filter(
      (queue) => {
        if (
          names.size > 0 &&
          !names.has(queue.name)
        ) {
          return false;
        }

        if (
          drivers.size > 0 &&
          !drivers.has(
            queue.configuration
              .driver,
          )
        ) {
          return false;
        }

        if (
          query.paused !==
            undefined &&
          queue.configuration
            .paused !==
            query.paused
        ) {
          return false;
        }

        if (
          search &&
          ![
            queue.name,
            queue.description,
            queue.configuration
              .driver,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(search)
        ) {
          return false;
        }

        return true;
      },
    );
  }

  private sortJobs(
    jobs:
      readonly Job[],
    sortBy:
      NonNullable<
        JobListQueryContract[
          'sortBy'
        ]
      >,
    direction:
      'asc' | 'desc',
  ): readonly Job[] {
    return [...jobs].sort(
      (left, right) => {
        let comparison: number;

        switch (sortBy) {
          case 'priority':
            comparison =
              JOB_PRIORITY_RANK[
                left.priority
              ] -
              JOB_PRIORITY_RANK[
                right.priority
              ];
            break;

          case 'executionCount':
            comparison =
              left.executionCount -
              right.executionCount;
            break;

          case 'nextExecutionAt':
            comparison =
              this.compareOptionalStrings(
                left.nextExecutionAt,
                right.nextExecutionAt,
              );
            break;

          default:
            comparison =
              String(
                left[sortBy],
              ).localeCompare(
                String(
                  right[sortBy],
                ),
              );
        }

        return direction === 'asc'
          ? comparison
          : -comparison;
      },
    );
  }

  private sortExecutions(
    executions:
      readonly JobExecution[],
    sortBy:
      NonNullable<
        JobExecutionListQueryContract[
          'sortBy'
        ]
      >,
    direction:
      'asc' | 'desc',
  ): readonly JobExecution[] {
    return [...executions].sort(
      (left, right) => {
        let comparison: number;

        switch (sortBy) {
          case 'startedAt':
            comparison =
              this.compareOptionalStrings(
                left.timing.startedAt,
                right.timing.startedAt,
              );
            break;

          case 'finishedAt':
            comparison =
              this.compareOptionalStrings(
                left.timing.finishedAt,
                right.timing.finishedAt,
              );
            break;

          case 'durationMs':
            comparison =
              (
                left.timing
                  .durationMs ?? 0
              ) -
              (
                right.timing
                  .durationMs ?? 0
              );
            break;

          case 'attemptNumber':
            comparison =
              left.attemptNumber -
              right.attemptNumber;
            break;

          default:
            comparison =
              String(
                left[sortBy],
              ).localeCompare(
                String(
                  right[sortBy],
                ),
              );
        }

        return direction === 'asc'
          ? comparison
          : -comparison;
      },
    );
  }

  private sortSchedules(
    schedules:
      readonly JobSchedule[],
    sortBy:
      NonNullable<
        JobScheduleListQueryContract[
          'sortBy'
        ]
      >,
    direction:
      'asc' | 'desc',
  ): readonly JobSchedule[] {
    return [...schedules].sort(
      (left, right) => {
        let comparison: number;

        switch (sortBy) {
          case 'nextRunAt':
            comparison =
              this.compareOptionalStrings(
                left.nextRunAt,
                right.nextRunAt,
              );
            break;

          case 'lastRunAt':
            comparison =
              this.compareOptionalStrings(
                left.lastRunAt,
                right.lastRunAt,
              );
            break;

          case 'runCount':
            comparison =
              left.runCount -
              right.runCount;
            break;

          default:
            comparison =
              left[sortBy]
                .localeCompare(
                  right[sortBy],
                );
        }

        return direction === 'asc'
          ? comparison
          : -comparison;
      },
    );
  }

  private sortQueues(
    queues:
      readonly JobQueue[],
    sortBy:
      NonNullable<
        JobQueueListQueryContract[
          'sortBy'
        ]
      >,
    direction:
      'asc' | 'desc',
  ): readonly JobQueue[] {
    return [...queues].sort(
      (left, right) => {
        let comparison: number;

        switch (sortBy) {
          case 'waiting':
          case 'active':
          case 'failed':
          case 'total':
            comparison =
              left.metrics[
                sortBy
              ] -
              right.metrics[
                sortBy
              ];
            break;

          default:
            comparison =
              left[sortBy]
                .localeCompare(
                  right[sortBy],
                );
        }

        return direction === 'asc'
          ? comparison
          : -comparison;
      },
    );
  }

  private paginate<T>(
    items:
      readonly T[],
    page?: number,
    pageSize?: number,
  ): {
    items: readonly T[];
    pagination:
      PaginationContract;
  } {
    const normalizedPage =
      typeof page ===
        'number' &&
      Number.isFinite(page)
        ? Math.max(
            1,
            Math.floor(page),
          )
        : 1;

    const normalizedPageSize =
      typeof pageSize ===
        'number' &&
      Number.isFinite(pageSize)
        ? Math.max(
            1,
            Math.min(
              500,
              Math.floor(pageSize),
            ),
          )
        : 50;

    const totalItems =
      items.length;

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          totalItems /
          normalizedPageSize,
        ),
      );

    const safePage =
      Math.min(
        normalizedPage,
        totalPages,
      );

    const offset =
      (
        safePage - 1
      ) *
      normalizedPageSize;

    return {
      items:
        items.slice(
          offset,
          offset +
            normalizedPageSize,
        ),
      pagination: {
        page: safePage,
        pageSize:
          normalizedPageSize,
        totalItems,
        totalPages,
        hasPreviousPage:
          safePage > 1,
        hasNextPage:
          safePage <
          totalPages,
      },
    };
  }

  private dateInRange(
    value: string,
    from?: string,
    to?: string,
  ): boolean {
    const timestamp =
      new Date(value).getTime();

    if (
      !Number.isFinite(
        timestamp,
      )
    ) {
      return false;
    }

    if (
      from &&
      timestamp <
        new Date(from)
          .getTime()
    ) {
      return false;
    }

    if (
      to &&
      timestamp >
        new Date(to)
          .getTime()
    ) {
      return false;
    }

    return true;
  }

  private optionalDateInRange(
    value?: string,
    from?: string,
    to?: string,
  ): boolean {
    if (
      !from &&
      !to
    ) {
      return true;
    }

    if (!value) {
      return false;
    }

    return this.dateInRange(
      value,
      from,
      to,
    );
  }

  private compareOptionalStrings(
    left?: string,
    right?: string,
  ): number {
    if (
      left === undefined &&
      right === undefined
    ) {
      return 0;
    }

    if (left === undefined) {
      return 1;
    }

    if (right === undefined) {
      return -1;
    }

    return left.localeCompare(
      right,
    );
  }

  private cloneJob(
    job: Job,
  ): Job {
    return {
      ...job,
      payload: {
        ...job.payload,
        data: {
          ...job.payload.data,
        },
      },
      configuration: {
        ...job.configuration,
        timeout: {
          ...job.configuration
            .timeout,
        },
        concurrency: {
          ...job.configuration
            .concurrency,
        },
        retention: {
          ...job.configuration
            .retention,
        },
      },
      correlation: {
        ...job.correlation,
      },
      ownership: {
        ...job.ownership,
      },
      dependencies:
        job.dependencies.map(
          (dependency) => ({
            ...dependency,
          }),
        ),
      progress: {
        ...job.progress,
      },
      tags: {
        tags: [
          ...job.tags.tags,
        ],
        labels: {
          ...job.tags.labels,
        },
      },
    };
  }

  private cloneExecution(
    execution:
      JobExecution,
  ): JobExecution {
    return {
      ...execution,
      payload: {
        ...execution.payload,
        data: {
          ...execution.payload
            .data,
        },
      },
      progress: {
        ...execution.progress,
      },
      timing: {
        ...execution.timing,
      },
      lease:
        execution.lease
          ? {
              ...execution.lease,
            }
          : undefined,
      correlation: {
        ...execution.correlation,
      },
      history:
        execution.history.map(
          (attempt) => ({
            ...attempt,
          }),
        ),
    };
  }
}