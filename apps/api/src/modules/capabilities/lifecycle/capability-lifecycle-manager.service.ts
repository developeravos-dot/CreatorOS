import { Injectable } from '@nestjs/common';

import type {
  CapabilityIdentifier,
  CapabilityLifecycleState,
} from '../contracts';
import { CapabilityLifecycleStateMachine } from '../domain';
import type {
  CapabilityStateSnapshot,
  CapabilityStateStore,
} from '../interfaces';
import type {
  CapabilityLifecycleHistoryEntry,
  CapabilityLifecycleTransitionRequest,
  CapabilityLifecycleTransitionResult,
} from './capability-lifecycle.types';

@Injectable()
export class CapabilityLifecycleManagerService {
  private readonly stateMachine =
    new CapabilityLifecycleStateMachine();

  private readonly memoryState =
    new Map<CapabilityIdentifier, CapabilityStateSnapshot>();

  private readonly history =
    new Map<
      CapabilityIdentifier,
      CapabilityLifecycleHistoryEntry[]
    >();

  constructor(
    private readonly externalStateStore?: CapabilityStateStore,
  ) {}

  async initialize(
    capabilityId: CapabilityIdentifier,
    state: CapabilityLifecycleState = 'discovered',
  ): Promise<CapabilityStateSnapshot> {
    const existing = await this.getState(capabilityId);

    if (existing) {
      return existing;
    }

    const snapshot: CapabilityStateSnapshot = {
      capabilityId,
      state,
      updatedAt: new Date().toISOString(),
    };

    await this.saveState(snapshot);

    return snapshot;
  }

  async getState(
    capabilityId: CapabilityIdentifier,
  ): Promise<CapabilityStateSnapshot | undefined> {
    if (this.externalStateStore) {
      const external =
        await this.externalStateStore.load(capabilityId);

      if (external) {
        this.memoryState.set(capabilityId, external);
        return external;
      }
    }

    return this.memoryState.get(capabilityId);
  }

  async transition(
    request: CapabilityLifecycleTransitionRequest,
  ): Promise<CapabilityLifecycleTransitionResult> {
    const current =
      (await this.getState(request.capabilityId)) ??
      (await this.initialize(request.capabilityId));

    if (current.state === request.targetState) {
      return {
        capabilityId: request.capabilityId,
        previousState: current.state,
        currentState: current.state,
        changed: false,
        transitionedAt: current.updatedAt,
        reason: request.reason,
        actorId: request.actorId,
        correlationId: request.correlationId,
        metadata: request.metadata,
      };
    }

    this.stateMachine.assertTransition(
      current.state,
      request.targetState,
    );

    const transitionedAt = new Date().toISOString();

    const nextSnapshot: CapabilityStateSnapshot = {
      capabilityId: request.capabilityId,
      state: request.targetState,
      updatedAt: transitionedAt,
      reason: request.reason,
      metadata: request.metadata,
    };

    await this.saveState(nextSnapshot);

    const result: CapabilityLifecycleTransitionResult = {
      capabilityId: request.capabilityId,
      previousState: current.state,
      currentState: request.targetState,
      changed: true,
      transitionedAt,
      reason: request.reason,
      actorId: request.actorId,
      correlationId: request.correlationId,
      metadata: request.metadata,
    };

    this.appendHistory(result);

    return result;
  }

  getHistory(
    capabilityId: CapabilityIdentifier,
  ): readonly CapabilityLifecycleHistoryEntry[] {
    return [...(this.history.get(capabilityId) ?? [])];
  }

  allowedTransitions(
    state: CapabilityLifecycleState,
  ): readonly CapabilityLifecycleState[] {
    return this.stateMachine.allowedTransitions(state);
  }

  async reset(
    capabilityId: CapabilityIdentifier,
  ): Promise<void> {
    this.memoryState.delete(capabilityId);
    this.history.delete(capabilityId);

    if (this.externalStateStore) {
      await this.externalStateStore.delete(capabilityId);
    }
  }

  private async saveState(
    snapshot: CapabilityStateSnapshot,
  ): Promise<void> {
    this.memoryState.set(snapshot.capabilityId, snapshot);

    if (this.externalStateStore) {
      await this.externalStateStore.save(snapshot);
    }
  }

  private appendHistory(
    result: CapabilityLifecycleTransitionResult,
  ): void {
    const entries =
      this.history.get(result.capabilityId) ?? [];

    entries.push({
      ...result,
      sequence: entries.length + 1,
    });

    this.history.set(result.capabilityId, entries);
  }
}