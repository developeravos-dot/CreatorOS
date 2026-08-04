import {
  Injectable,
} from '@nestjs/common';

import type {
  QueueWorkerRegistration,
} from '../../../../../modules/queue-infrastructure';
import {
  LoadBalancerService,
  type LoadBalancerDecision,
  type LoadBalancerRequest,
} from './load-balancer.service';

export interface QueueAffinityBinding {
  readonly queueName: string;
  readonly affinityKey: string;
  readonly workerName: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly expiresAt: Date | null;
  readonly metadata:
    Readonly<Record<string, unknown>>;
}

export interface BindQueueAffinityInput {
  readonly queueName: string;
  readonly affinityKey: string;
  readonly workerName: string;
  readonly ttlMs?: number;
  readonly metadata?:
    Readonly<Record<string, unknown>>;
  readonly now?: Date;
  readonly overwrite?: boolean;
}

export interface QueueAffinityRouteRequest
  extends LoadBalancerRequest {
  readonly affinityKey: string;
  readonly affinityTtlMs?: number;
  readonly refreshAffinity?: boolean;
  readonly rebindOnFallback?: boolean;
}

export interface QueueAffinityRouteResult {
  readonly decision:
    LoadBalancerDecision;

  readonly binding:
    QueueAffinityBinding | null;

  readonly affinityHit: boolean;

  readonly affinityCreated: boolean;

  readonly affinityRebound: boolean;

  readonly routedAt: Date;
}

export interface QueueAffinityMetrics {
  readonly totalBindings: number;
  readonly activeBindings: number;
  readonly expiredBindings: number;
  readonly affinityHits: number;
  readonly affinityMisses: number;
  readonly affinityCreates: number;
  readonly affinityRebinds: number;
  readonly affinityRemovals: number;
  readonly collectedAt: Date;
}

@Injectable()
export class QueueAffinityService {
  private readonly bindings =
    new Map<string, QueueAffinityBinding>();

  private affinityHits = 0;

  private affinityMisses = 0;

  private affinityCreates = 0;

  private affinityRebinds = 0;

  private affinityRemovals = 0;

  constructor(
    private readonly loadBalancer:
      LoadBalancerService,
  ) {}

  bind(
    input:
      BindQueueAffinityInput,
  ): QueueAffinityBinding {
    const queueName =
      this.requireText(
        input.queueName,
        'queueName',
      );

    const affinityKey =
      this.requireText(
        input.affinityKey,
        'affinityKey',
      );

    const workerName =
      this.requireText(
        input.workerName,
        'workerName',
      );

    const now =
      new Date(
        input.now ??
        new Date(),
      );

    const ttlMs =
      input.ttlMs === undefined
        ? undefined
        : this.normalizeTtl(
            input.ttlMs,
          );

    const key =
      this.createBindingKey(
        queueName,
        affinityKey,
      );

    const existing =
      this.getActiveBindingByKey(
        key,
        now,
      );

    if (
      existing &&
      existing.workerName !== workerName &&
      !input.overwrite
    ) {
      throw new Error(
        `Affinity ${affinityKey} for queue ${queueName} is already bound to worker ${existing.workerName}.`,
      );
    }

    const binding:
      QueueAffinityBinding = {
        queueName,
        affinityKey,
        workerName,
        createdAt:
          existing?.createdAt ??
          now,
        updatedAt: now,
        expiresAt:
          ttlMs === undefined
            ? null
            : new Date(
                now.getTime() +
                ttlMs,
              ),
        metadata:
          this.cloneRecord(
            input.metadata ?? {},
          ),
      };

    this.bindings.set(
      key,
      this.cloneBinding(
        binding,
      ),
    );

    if (existing) {
      this.affinityRebinds += 1;
    } else {
      this.affinityCreates += 1;
    }

    return this.cloneBinding(
      binding,
    );
  }

  resolve(
    queueName: string,
    affinityKey: string,
    now =
      new Date(),
  ): QueueAffinityBinding | null {
    const normalizedQueueName =
      this.requireText(
        queueName,
        'queueName',
      );

    const normalizedAffinityKey =
      this.requireText(
        affinityKey,
        'affinityKey',
      );

    const key =
      this.createBindingKey(
        normalizedQueueName,
        normalizedAffinityKey,
      );

    const binding =
      this.getActiveBindingByKey(
        key,
        new Date(now),
      );

    return binding
      ? this.cloneBinding(
          binding,
        )
      : null;
  }

  route(
    request:
      QueueAffinityRouteRequest,
  ): QueueAffinityRouteResult {
    const queueName =
      this.requireText(
        request.queueName,
        'queueName',
      );

    const affinityKey =
      this.requireText(
        request.affinityKey,
        'affinityKey',
      );

    const now =
      new Date(
        request.now ??
        new Date(),
      );

    const existing =
      this.resolve(
        queueName,
        affinityKey,
        now,
      );

    if (existing) {
      this.affinityHits += 1;
    } else {
      this.affinityMisses += 1;
    }

    const decision =
      this.loadBalancer.balance({
        ...request,
        queueName,
        stickyWorkerName:
          existing?.workerName ??
          request.stickyWorkerName,
        preserveStickyWorker:
          Boolean(
            existing ||
            request.preserveStickyWorker,
          ),
        now,
      });

    let resultingBinding =
      existing;

    let affinityCreated =
      false;

    let affinityRebound =
      false;

    const selectedWorker =
      decision.selected;

    if (selectedWorker) {
      if (!existing) {
        resultingBinding =
          this.bind({
            queueName,
            affinityKey,
            workerName:
              selectedWorker.workerName,
            ttlMs:
              request.affinityTtlMs,
            now,
            overwrite: true,
          });

        affinityCreated = true;
      } else if (
        existing.workerName !==
          selectedWorker.workerName &&
        request.rebindOnFallback
      ) {
        resultingBinding =
          this.bind({
            queueName,
            affinityKey,
            workerName:
              selectedWorker.workerName,
            ttlMs:
              request.affinityTtlMs,
            now,
            overwrite: true,
          });

        affinityRebound = true;
      } else if (
        existing.workerName ===
          selectedWorker.workerName &&
        request.refreshAffinity
      ) {
        resultingBinding =
          this.bind({
            queueName,
            affinityKey,
            workerName:
              selectedWorker.workerName,
            ttlMs:
              request.affinityTtlMs,
            metadata:
              existing.metadata,
            now,
            overwrite: true,
          });
      }
    }

    return {
      decision:
        this.cloneDecision(
          decision,
        ),
      binding:
        resultingBinding
          ? this.cloneBinding(
              resultingBinding,
            )
          : null,
      affinityHit:
        Boolean(existing),
      affinityCreated,
      affinityRebound,
      routedAt: now,
    };
  }

  unbind(
    queueName: string,
    affinityKey: string,
  ): boolean {
    const key =
      this.createBindingKey(
        this.requireText(
          queueName,
          'queueName',
        ),
        this.requireText(
          affinityKey,
          'affinityKey',
        ),
      );

    const removed =
      this.bindings.delete(key);

    if (removed) {
      this.affinityRemovals += 1;
    }

    return removed;
  }

  unbindWorker(
    workerName: string,
  ): number {
    const normalizedWorkerName =
      this.requireText(
        workerName,
        'workerName',
      );

    let removed = 0;

    for (
      const [key, binding]
      of this.bindings
    ) {
      if (
        binding.workerName !==
        normalizedWorkerName
      ) {
        continue;
      }

      this.bindings.delete(key);
      removed += 1;
    }

    this.affinityRemovals +=
      removed;

    return removed;
  }

  list(
    now =
      new Date(),
  ): readonly QueueAffinityBinding[] {
    const currentTime =
      new Date(now);

    this.removeExpired(
      currentTime,
    );

    return [
      ...this.bindings.values(),
    ]
      .sort(
        (left, right) => {
          const queueComparison =
            left.queueName.localeCompare(
              right.queueName,
            );

          if (queueComparison !== 0) {
            return queueComparison;
          }

          return left.affinityKey
            .localeCompare(
              right.affinityKey,
            );
        },
      )
      .map(
        (binding) =>
          this.cloneBinding(
            binding,
          ),
      );
  }

  getMetrics(
    now =
      new Date(),
  ): QueueAffinityMetrics {
    const currentTime =
      new Date(now);

    const allBindings =
      [...this.bindings.values()];

    const expiredBindings =
      allBindings.filter(
        (binding) =>
          this.isExpired(
            binding,
            currentTime,
          ),
      ).length;

    return {
      totalBindings:
        allBindings.length,
      activeBindings:
        allBindings.length -
        expiredBindings,
      expiredBindings,
      affinityHits:
        this.affinityHits,
      affinityMisses:
        this.affinityMisses,
      affinityCreates:
        this.affinityCreates,
      affinityRebinds:
        this.affinityRebinds,
      affinityRemovals:
        this.affinityRemovals,
      collectedAt:
        currentTime,
    };
  }

  clear(): void {
    this.bindings.clear();

    this.affinityHits = 0;
    this.affinityMisses = 0;
    this.affinityCreates = 0;
    this.affinityRebinds = 0;
    this.affinityRemovals = 0;
  }

  private getActiveBindingByKey(
    key: string,
    now: Date,
  ): QueueAffinityBinding | null {
    const binding =
      this.bindings.get(key);

    if (!binding) {
      return null;
    }

    if (
      this.isExpired(
        binding,
        now,
      )
    ) {
      this.bindings.delete(key);

      return null;
    }

    return this.cloneBinding(
      binding,
    );
  }

  private removeExpired(
    now: Date,
  ): number {
    let removed = 0;

    for (
      const [key, binding]
      of this.bindings
    ) {
      if (
        !this.isExpired(
          binding,
          now,
        )
      ) {
        continue;
      }

      this.bindings.delete(key);
      removed += 1;
    }

    return removed;
  }

  private isExpired(
    binding:
      QueueAffinityBinding,
    now: Date,
  ): boolean {
    return (
      binding.expiresAt !== null &&
      binding.expiresAt.getTime() <=
        now.getTime()
    );
  }

  private createBindingKey(
    queueName: string,
    affinityKey: string,
  ): string {
    return JSON.stringify([
      queueName,
      affinityKey,
    ]);
  }

  private normalizeTtl(
    value: number,
  ): number {
    if (
      !Number.isInteger(value) ||
      value <= 0
    ) {
      throw new Error(
        'Affinity ttlMs must be a positive integer.',
      );
    }

    return value;
  }

  private requireText(
    value: string,
    fieldName: string,
  ): string {
    const normalized =
      value.trim();

    if (!normalized) {
      throw new Error(
        `${fieldName} is required.`,
      );
    }

    return normalized;
  }

  private cloneBinding(
    binding:
      QueueAffinityBinding,
  ): QueueAffinityBinding {
    return {
      ...binding,
      createdAt:
        new Date(
          binding.createdAt,
        ),
      updatedAt:
        new Date(
          binding.updatedAt,
        ),
      expiresAt:
        binding.expiresAt
          ? new Date(
              binding.expiresAt,
            )
          : null,
      metadata:
        this.cloneRecord(
          binding.metadata,
        ),
    };
  }

  private cloneDecision(
    decision:
      LoadBalancerDecision,
  ): LoadBalancerDecision {
    return {
      ...decision,
      selected:
        decision.selected
          ? this.cloneRegistration(
              decision.selected,
            )
          : null,
      selectedCandidate:
        decision.selectedCandidate
          ? {
              ...decision.selectedCandidate,
              capabilities: [
                ...decision
                  .selectedCandidate
                  .capabilities,
              ],
              rejectionReasons: [
                ...decision
                  .selectedCandidate
                  .rejectionReasons,
              ],
              score: {
                ...decision
                  .selectedCandidate
                  .score,
              },
              registration:
                this.cloneRegistration(
                  decision
                    .selectedCandidate
                    .registration,
                ),
            }
          : null,
      balancedAt:
        new Date(
          decision.balancedAt,
        ),
    };
  }

  private cloneRegistration(
    registration:
      QueueWorkerRegistration,
  ): QueueWorkerRegistration {
    return {
      ...registration,
    };
  }

  private cloneRecord(
    record:
      Readonly<Record<string, unknown>>,
  ): Readonly<Record<string, unknown>> {
    return {
      ...record,
    };
  }
}