import { Injectable } from '@nestjs/common';

import type {
  DistributedExecutionRequest,
} from '../contracts';
import {
  createDistributedExecutionRecord,
  type DistributedExecutionRecord,
} from '../models';
import {
  DistributedWorkerRuntimeService,
} from './distributed-worker-runtime.service';
import {
  ExecutionLeaseManagerService,
} from './execution-lease-manager.service';

@Injectable()
export class ExecutionRuntimeCoordinatorService {
  private readonly executions =
    new Map<string, DistributedExecutionRecord>();

  constructor(
    private readonly workers:
      DistributedWorkerRuntimeService =
        new DistributedWorkerRuntimeService(),
    private readonly leases:
      ExecutionLeaseManagerService =
        new ExecutionLeaseManagerService(),
  ) {}

  submit(
    request: DistributedExecutionRequest,
  ): DistributedExecutionRecord {
    const executionId = this.text(
      request.executionId,
      'executionId',
    );

    if (this.executions.has(executionId)) {
      throw new Error(
        `Distributed execution ${executionId} already exists.`,
      );
    }

    const execution = createDistributedExecutionRecord({
      ...request,
      executionId,
      workflowId: this.text(
        request.workflowId,
        'workflowId',
      ),
      stepId: this.text(request.stepId, 'stepId'),
      requiredCapabilities:
        this.capabilities(
          request.requiredCapabilities,
        ),
      trace: {
        correlationId: this.text(
          request.trace.correlationId,
          'correlationId',
        ),
        traceId: this.text(
          request.trace.traceId,
          'traceId',
        ),
        parentTraceId:
          request.trace.parentTraceId?.trim() || null,
      },
    });

    this.executions.set(execution.executionId, execution);
    return this.clone(execution);
  }

  assignNext(
    executionId: string,
    leaseDurationMs: number,
    now = new Date(),
  ): DistributedExecutionRecord {
    const current = this.require(executionId);

    if (
      current.state !== 'pending' &&
      current.state !== 'retrying' &&
      current.state !== 'reassigned'
    ) {
      throw new Error(
        `Execution ${current.executionId} cannot be assigned from state ${current.state}.`,
      );
    }

    const worker = this.workers.findEligible(
      current.requiredCapabilities,
    )[0];

    if (!worker) {
      throw new Error(
        `No eligible worker is available for execution ${current.executionId}.`,
      );
    }

    const lease = this.leases.acquire({
      executionId: current.executionId,
      workerId: worker.workerId,
      leaseDurationMs,
      now,
    });

    if (!lease) {
      throw new Error(
        `Execution ${current.executionId} already has an active lease.`,
      );
    }

    this.workers.assign(
      worker.workerId,
      current.executionId,
    );

    const assigned: DistributedExecutionRecord = {
      ...current,
      state: 'leased',
      assignedWorkerId: worker.workerId,
      fencingToken: lease.fencingToken,
      attempt: current.attempt + 1,
      updatedAt: new Date(now),
    };

    this.executions.set(assigned.executionId, assigned);
    return this.clone(assigned);
  }

  start(
    executionId: string,
    workerId: string,
    fencingToken: number,
    now = new Date(),
  ): DistributedExecutionRecord {
    const current = this.require(executionId);
    this.assertOwnership(
      current,
      workerId,
      fencingToken,
    );

    if (current.state !== 'leased') {
      throw new Error(
        `Execution ${current.executionId} is not leased.`,
      );
    }

    const running: DistributedExecutionRecord = {
      ...current,
      state: 'running',
      startedAt: new Date(now),
      updatedAt: new Date(now),
    };

    this.executions.set(running.executionId, running);
    return this.clone(running);
  }

  complete(
    executionId: string,
    workerId: string,
    fencingToken: number,
    now = new Date(),
  ): DistributedExecutionRecord {
    const current = this.require(executionId);
    this.assertOwnership(
      current,
      workerId,
      fencingToken,
    );

    if (current.state !== 'running') {
      throw new Error(
        `Execution ${current.executionId} is not running.`,
      );
    }

    this.leases.release(
      current.executionId,
      workerId,
      fencingToken,
      now,
    );

    this.workers.release(
      workerId,
      current.executionId,
    );

    const completed: DistributedExecutionRecord = {
      ...current,
      state: 'succeeded',
      completedAt: new Date(now),
      updatedAt: new Date(now),
      lastError: null,
    };

    this.executions.set(completed.executionId, completed);
    return this.clone(completed);
  }

  fail(
    executionId: string,
    workerId: string,
    fencingToken: number,
    error: string,
    retryable: boolean,
    now = new Date(),
  ): DistributedExecutionRecord {
    const current = this.require(executionId);
    this.assertOwnership(
      current,
      workerId,
      fencingToken,
    );

    this.leases.release(
      current.executionId,
      workerId,
      fencingToken,
      now,
    );

    this.workers.release(
      workerId,
      current.executionId,
    );

    const failed: DistributedExecutionRecord = {
      ...current,
      state: retryable ? 'retrying' : 'failed',
      assignedWorkerId: null,
      fencingToken: null,
      updatedAt: new Date(now),
      completedAt: retryable ? null : new Date(now),
      lastError: this.text(error, 'error'),
    };

    this.executions.set(failed.executionId, failed);
    return this.clone(failed);
  }

  recoverLostWorker(
    workerId: string,
    now = new Date(),
  ): readonly DistributedExecutionRecord[] {
    const worker = this.workers.get(workerId);

    if (!worker) {
      throw new Error(
        `Distributed worker ${workerId} was not found.`,
      );
    }

    this.workers.setState(workerId, 'offline');

    const recovered: DistributedExecutionRecord[] = [];

    for (const execution of this.executions.values()) {
      if (
        execution.assignedWorkerId !== workerId ||
        (
          execution.state !== 'leased' &&
          execution.state !== 'running'
        )
      ) {
        continue;
      }

      const lease = this.leases.get(
        execution.executionId,
      );

      if (
        lease &&
        lease.releasedAt === null
      ) {
        this.leases.release(
          lease.executionId,
          lease.workerId,
          lease.fencingToken,
          now,
        );
      }

      this.workers.release(
        workerId,
        execution.executionId,
      );

      const reassigned: DistributedExecutionRecord = {
        ...execution,
        state: 'reassigned',
        assignedWorkerId: null,
        fencingToken: null,
        updatedAt: new Date(now),
        lastError:
          `Worker ${workerId} was lost during execution.`,
      };

      this.executions.set(
        reassigned.executionId,
        reassigned,
      );

      recovered.push(
        this.clone(reassigned),
      );
    }

    return recovered.sort(
      (left, right) =>
        left.executionId.localeCompare(
          right.executionId,
        ),
    );
  }

  get(
    executionId: string,
  ): DistributedExecutionRecord | null {
    const execution = this.executions.get(executionId);
    return execution ? this.clone(execution) : null;
  }

  list(): readonly DistributedExecutionRecord[] {
    return [...this.executions.values()]
      .sort((left, right) =>
        left.executionId.localeCompare(
          right.executionId,
        ),
      )
      .map((execution) => this.clone(execution));
  }

  getWorkerRuntime(): DistributedWorkerRuntimeService {
    return this.workers;
  }

  getLeaseManager(): ExecutionLeaseManagerService {
    return this.leases;
  }

  private assertOwnership(
    execution: DistributedExecutionRecord,
    workerId: string,
    fencingToken: number,
  ): void {
    if (
      execution.assignedWorkerId !== workerId ||
      execution.fencingToken !== fencingToken
    ) {
      throw new Error(
        'Distributed execution ownership mismatch.',
      );
    }
  }

  private require(
    executionId: string,
  ): DistributedExecutionRecord {
    const normalized = this.text(
      executionId,
      'executionId',
    );

    const execution = this.executions.get(normalized);

    if (!execution) {
      throw new Error(
        `Distributed execution ${normalized} was not found.`,
      );
    }

    return execution;
  }

  private capabilities(
    capabilities: readonly string[],
  ): readonly string[] {
    const normalized = [
      ...new Set(
        capabilities.map((capability) =>
          this.text(capability, 'capability'),
        ),
      ),
    ].sort();

    if (normalized.length === 0) {
      throw new Error(
        'At least one required capability is required.',
      );
    }

    return normalized;
  }

  private text(value: string, field: string): string {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error(`${field} is required.`);
    }

    return normalized;
  }

  private clone(
    execution: DistributedExecutionRecord,
  ): DistributedExecutionRecord {
    return {
      ...execution,
      trace: {
        ...execution.trace,
      },
      payload: structuredClone(execution.payload),
      requiredCapabilities: [
        ...execution.requiredCapabilities,
      ],
      createdAt: new Date(execution.createdAt),
      updatedAt: new Date(execution.updatedAt),
      startedAt: execution.startedAt
        ? new Date(execution.startedAt)
        : null,
      completedAt: execution.completedAt
        ? new Date(execution.completedAt)
        : null,
    };
  }
}
