import { Injectable } from '@nestjs/common';

import type {
  DistributedWorkerRegistration,
} from '../contracts';
import {
  createDistributedWorkerRuntimeRecord,
  type DistributedWorkerRuntimeRecord,
} from '../models';

@Injectable()
export class DistributedWorkerRuntimeService {
  private readonly workers =
    new Map<string, DistributedWorkerRuntimeRecord>();

  register(
    registration: DistributedWorkerRegistration,
  ): DistributedWorkerRuntimeRecord {
    const workerId = this.text(
      registration.workerId,
      'workerId',
    );

    if (this.workers.has(workerId)) {
      throw new Error(
        `Distributed worker ${workerId} is already registered.`,
      );
    }

    if (
      !Number.isInteger(registration.maximumConcurrency) ||
      registration.maximumConcurrency < 1
    ) {
      throw new Error(
        'maximumConcurrency must be a positive integer.',
      );
    }

    const worker = createDistributedWorkerRuntimeRecord({
      ...registration,
      workerId,
      nodeId: this.text(registration.nodeId, 'nodeId'),
      capabilities: this.capabilities(
        registration.capabilities,
      ),
    });

    this.workers.set(worker.workerId, worker);
    return this.clone(worker);
  }

  heartbeat(
    workerId: string,
    now = new Date(),
  ): DistributedWorkerRuntimeRecord {
    const current = this.require(workerId);

    const updated: DistributedWorkerRuntimeRecord = {
      ...current,
      lastHeartbeatAt: new Date(now),
    };

    this.workers.set(updated.workerId, updated);
    return this.clone(updated);
  }

  assign(
    workerId: string,
    executionId: string,
  ): DistributedWorkerRuntimeRecord {
    const current = this.require(workerId);
    const normalizedExecutionId = this.text(
      executionId,
      'executionId',
    );

    if (current.state !== 'active') {
      throw new Error(
        `Distributed worker ${current.workerId} is not active.`,
      );
    }

    if (
      current.activeExecutionIds.length >=
      current.maximumConcurrency
    ) {
      throw new Error(
        `Distributed worker ${current.workerId} is at capacity.`,
      );
    }

    if (
      current.activeExecutionIds.includes(
        normalizedExecutionId,
      )
    ) {
      return this.clone(current);
    }

    const updated: DistributedWorkerRuntimeRecord = {
      ...current,
      activeExecutionIds: [
        ...current.activeExecutionIds,
        normalizedExecutionId,
      ],
    };

    this.workers.set(updated.workerId, updated);
    return this.clone(updated);
  }

  release(
    workerId: string,
    executionId: string,
  ): DistributedWorkerRuntimeRecord {
    const current = this.require(workerId);

    const updated: DistributedWorkerRuntimeRecord = {
      ...current,
      activeExecutionIds:
        current.activeExecutionIds.filter(
          (candidate) => candidate !== executionId,
        ),
    };

    this.workers.set(updated.workerId, updated);
    return this.clone(updated);
  }

  setState(
    workerId: string,
    state: 'active' | 'draining' | 'offline',
  ): DistributedWorkerRuntimeRecord {
    const current = this.require(workerId);

    const updated: DistributedWorkerRuntimeRecord = {
      ...current,
      state,
    };

    this.workers.set(updated.workerId, updated);
    return this.clone(updated);
  }

  findEligible(
    requiredCapabilities: readonly string[],
  ): readonly DistributedWorkerRuntimeRecord[] {
    const required = this.capabilities(
      requiredCapabilities,
    );

    return [...this.workers.values()]
      .filter((worker) =>
        worker.state === 'active' &&
        worker.activeExecutionIds.length <
          worker.maximumConcurrency &&
        required.every((capability) =>
          worker.capabilities.includes(capability),
        ),
      )
      .sort((left, right) => {
        const loadDifference =
          left.activeExecutionIds.length /
            left.maximumConcurrency -
          right.activeExecutionIds.length /
            right.maximumConcurrency;

        return loadDifference !== 0
          ? loadDifference
          : left.workerId.localeCompare(right.workerId);
      })
      .map((worker) => this.clone(worker));
  }

  get(
    workerId: string,
  ): DistributedWorkerRuntimeRecord | null {
    const worker = this.workers.get(workerId);
    return worker ? this.clone(worker) : null;
  }

  list(): readonly DistributedWorkerRuntimeRecord[] {
    return [...this.workers.values()]
      .sort((left, right) =>
        left.workerId.localeCompare(right.workerId),
      )
      .map((worker) => this.clone(worker));
  }

  private require(
    workerId: string,
  ): DistributedWorkerRuntimeRecord {
    const normalized = this.text(workerId, 'workerId');
    const worker = this.workers.get(normalized);

    if (!worker) {
      throw new Error(
        `Distributed worker ${normalized} was not found.`,
      );
    }

    return worker;
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
        'At least one worker capability is required.',
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
    worker: DistributedWorkerRuntimeRecord,
  ): DistributedWorkerRuntimeRecord {
    return {
      ...worker,
      capabilities: [...worker.capabilities],
      activeExecutionIds: [
        ...worker.activeExecutionIds,
      ],
      registeredAt: new Date(worker.registeredAt),
      lastHeartbeatAt: new Date(
        worker.lastHeartbeatAt,
      ),
    };
  }
}
