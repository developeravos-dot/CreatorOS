import type {
  CapabilityIdentifier,
} from '../../../../contracts';
import type {
  CapabilityProvider,
} from '../../../../interfaces';
import {
  DeterministicSdkIdGenerator,
  FakeSdkClock,
} from '../../mocks';
import type {
  MockRuntimeFailurePlan,
  MockRuntimeInstance,
  MockRuntimeInstanceState,
  MockRuntimeOperation,
  StartMockRuntimeInput,
  StopMockRuntimeInput,
} from '../contracts';
import {
  MockCapabilityRuntimeRegistry,
} from '../registry';
import {
  MockRuntimeCallTracker,
} from '../tracking';

type RuntimeLifecycleHook =
  () => void | Promise<void>;

export class MockCapabilityRuntime {
  private readonly instances =
    new Map<string, MockRuntimeInstance>();

  private readonly failurePlans:
    MockRuntimeFailurePlan[] = [];

  constructor(
    readonly clock =
      new FakeSdkClock(),
    readonly ids =
      new DeterministicSdkIdGenerator(
        'runtime-instance',
      ),
    readonly calls =
      new MockRuntimeCallTracker(clock),
    readonly registry =
      new MockCapabilityRuntimeRegistry(
        clock,
        calls,
      ),
  ) {}

  register(
    manifest:
      Parameters<
        MockCapabilityRuntimeRegistry['register']
      >[0]['manifest'],
    provider: CapabilityProvider,
  ): void {
    this.throwPlannedFailure(
      'register',
      manifest.id,
    );

    this.registry.register({
      manifest,
      provider,
    });
  }

  unregister(
    capabilityId: CapabilityIdentifier,
  ): void {
    this.assertNoActiveInstances(
      capabilityId,
    );

    this.throwPlannedFailure(
      'unregister',
      capabilityId,
    );

    this.registry.unregister(
      capabilityId,
    );
  }

  async initialize(
    capabilityId: CapabilityIdentifier,
  ): Promise<void> {
    const registration =
      this.registry.require(
        capabilityId,
      );

    await this.executeHook(
      'initialize',
      capabilityId,
      registration.provider,
    );
  }

  async activate(
    capabilityId: CapabilityIdentifier,
  ): Promise<void> {
    const registration =
      this.registry.require(
        capabilityId,
      );

    await this.executeHook(
      'activate',
      capabilityId,
      registration.provider,
    );
  }

  async start(
    input: StartMockRuntimeInput,
  ): Promise<MockRuntimeInstance> {
    const registration =
      this.registry.require(
        input.capabilityId,
      );

    this.throwPlannedFailure(
      'start',
      input.capabilityId,
    );

    const instanceId =
      input.instanceId ??
      this.ids.generate();

    if (
      this.instances.has(instanceId)
    ) {
      throw new Error(
        `Mock runtime instance "${instanceId}" already exists.`,
      );
    }

    try {
      await this.invokeLifecycleHook(
        registration.provider,
        'initialize',
      );

      this.calls.record({
        operation: 'initialize',
        capabilityId:
          input.capabilityId,
        instanceId,
      });

      await this.invokeLifecycleHook(
        registration.provider,
        'activate',
      );

      this.calls.record({
        operation: 'activate',
        capabilityId:
          input.capabilityId,
        instanceId,
      });

      const instance =
        this.createInstance({
          instanceId,
          capabilityId:
            input.capabilityId,
          version:
            registration.version,
          state: 'active',
          startedAt:
            this.clock.nowIso(),
          metadata: input.metadata,
        });

      this.instances.set(
        instanceId,
        instance,
      );

      this.calls.record({
        operation: 'start',
        capabilityId:
          input.capabilityId,
        instanceId,
        metadata: input.metadata,
      });

      return instance;
    } catch (error) {
      const failed =
        this.createInstance({
          instanceId,
          capabilityId:
            input.capabilityId,
          version:
            registration.version,
          state: 'failed',
          failure:
            error instanceof Error
              ? error.message
              : String(error),
          metadata: input.metadata,
        });

      this.instances.set(
        instanceId,
        failed,
      );

      this.calls.record({
        operation: 'start',
        capabilityId:
          input.capabilityId,
        instanceId,
        successful: false,
        error,
        metadata: input.metadata,
      });

      throw error;
    }
  }

  async stop(
    input: StopMockRuntimeInput,
  ): Promise<MockRuntimeInstance> {
    const current =
      this.requireInstance(
        input.instanceId,
      );

    if (current.state !== 'active') {
      throw new Error(
        `Mock runtime instance "${input.instanceId}" is not active.`,
      );
    }

    this.throwPlannedFailure(
      'stop',
      current.capabilityId,
    );

    const registration =
      this.registry.require(
        current.capabilityId,
      );

    try {
      await this.invokeLifecycleHook(
        registration.provider,
        'stop',
      );

      const stopped =
        this.createInstance({
          ...current,
          state: 'stopped',
          stoppedAt:
            this.clock.nowIso(),
          metadata:
            input.metadata ??
            current.metadata,
        });

      this.instances.set(
        input.instanceId,
        stopped,
      );

      this.calls.record({
        operation: 'stop',
        capabilityId:
          current.capabilityId,
        instanceId:
          input.instanceId,
        metadata: {
          ...(input.metadata ?? {}),
          ...(input.reason
            ? {
                reason:
                  input.reason,
              }
            : {}),
        },
      });

      return stopped;
    } catch (error) {
      const failed =
        this.createInstance({
          ...current,
          state: 'failed',
          failure:
            error instanceof Error
              ? error.message
              : String(error),
        });

      this.instances.set(
        input.instanceId,
        failed,
      );

      this.calls.record({
        operation: 'stop',
        capabilityId:
          current.capabilityId,
        instanceId:
          input.instanceId,
        successful: false,
        error,
      });

      throw error;
    }
  }

  getInstance(
    instanceId: string,
  ): MockRuntimeInstance | undefined {
    return this.instances.get(
      instanceId,
    );
  }

  requireInstance(
    instanceId: string,
  ): MockRuntimeInstance {
    const instance =
      this.getInstance(instanceId);

    if (!instance) {
      throw new Error(
        `Mock runtime instance "${instanceId}" was not found.`,
      );
    }

    return instance;
  }

  listInstances():
    readonly MockRuntimeInstance[] {
    return [...this.instances.values()];
  }

  listByCapability(
    capabilityId: CapabilityIdentifier,
  ): readonly MockRuntimeInstance[] {
    return this.listInstances().filter(
      (instance) =>
        instance.capabilityId ===
        capabilityId,
    );
  }

  listByState(
    state: MockRuntimeInstanceState,
  ): readonly MockRuntimeInstance[] {
    return this.listInstances().filter(
      (instance) =>
        instance.state === state,
    );
  }

  failNext(
    operation: MockRuntimeOperation,
    error:
      Error =
        new Error(
          `Planned mock runtime ${operation} failure.`,
        ),
    capabilityId?:
      CapabilityIdentifier,
  ): void {
    this.failTimes(
      operation,
      1,
      error,
      capabilityId,
    );
  }

  failTimes(
    operation: MockRuntimeOperation,
    times: number,
    error:
      Error =
        new Error(
          `Planned mock runtime ${operation} failure.`,
        ),
    capabilityId?:
      CapabilityIdentifier,
  ): void {
    if (
      !Number.isInteger(times) ||
      times <= 0
    ) {
      throw new Error(
        'Mock runtime failure count must be a positive integer.',
      );
    }

    this.failurePlans.push({
      operation,
      error,
      capabilityId,
      remaining: times,
    });
  }

  reset(): void {
    this.instances.clear();
    this.failurePlans.length = 0;
    this.registry.clear();
    this.calls.clear();
    this.ids.reset();

    this.calls.record({
      operation: 'reset',
    });
  }

  private async executeHook(
    operation:
      | 'initialize'
      | 'activate',
    capabilityId:
      CapabilityIdentifier,
    provider: CapabilityProvider,
  ): Promise<void> {
    this.throwPlannedFailure(
      operation,
      capabilityId,
    );

    try {
      await this.invokeLifecycleHook(
        provider,
        operation,
      );

      this.calls.record({
        operation,
        capabilityId,
      });
    } catch (error) {
      this.calls.record({
        operation,
        capabilityId,
        successful: false,
        error,
      });

      throw error;
    }
  }

  private async invokeLifecycleHook(
    provider: CapabilityProvider,
    hook:
      | 'initialize'
      | 'activate'
      | 'stop',
  ): Promise<void> {
    const callback =
      provider.lifecycle[hook] as unknown as
        | RuntimeLifecycleHook
        | undefined;

    if (!callback) {
      return;
    }

    await callback.call(
      provider.lifecycle,
    );
  }

  private throwPlannedFailure(
    operation: MockRuntimeOperation,
    capabilityId?:
      CapabilityIdentifier,
  ): void {
    const index =
      this.failurePlans.findIndex(
        (plan) =>
          plan.operation === operation &&
          (
            !plan.capabilityId ||
            plan.capabilityId ===
              capabilityId
          ),
      );

    if (index < 0) {
      return;
    }

    const plan =
      this.failurePlans[index];

    if (!plan) {
      return;
    }

    const remaining =
      plan.remaining - 1;

    if (remaining <= 0) {
      this.failurePlans.splice(
        index,
        1,
      );
    } else {
      this.failurePlans[index] = {
        ...plan,
        remaining,
      };
    }

    this.calls.record({
      operation,
      capabilityId,
      successful: false,
      error: plan.error,
    });

    throw plan.error;
  }

  private assertNoActiveInstances(
    capabilityId:
      CapabilityIdentifier,
  ): void {
    const active =
      this.listByCapability(
        capabilityId,
      ).some(
        (instance) =>
          instance.state === 'active',
      );

    if (active) {
      throw new Error(
        `Mock runtime capability "${capabilityId}" has active instances and cannot be unregistered.`,
      );
    }
  }

  private createInstance(
    input: MockRuntimeInstance,
  ): MockRuntimeInstance {
    return Object.freeze({
      ...input,
    });
  }
}