import type {
  CapabilityMetadata,
} from '../../../../contracts';
import {
  MockSdkContextFactory,
} from '../../mocks';
import {
  MockCapabilityRuntime,
} from '../../runtime';
import type {
  CapabilityTestingHarness,
  CapabilityTestingHarnessSnapshot,
  CreateCapabilityTestingHarnessInput,
} from '../contracts';
import {
  CapabilityTestFixtureBuilder,
} from '../fixtures';

export class DefaultCapabilityTestingHarness
  implements CapabilityTestingHarness
{
  readonly fixture;
  readonly contextFixture;
  readonly context;
  readonly runtime;

  constructor(
    input:
      CreateCapabilityTestingHarnessInput = {},
  ) {
    this.fixture =
      input.fixture ??
      new CapabilityTestFixtureBuilder()
        .build();

    this.contextFixture =
      input.context ??
      new MockSdkContextFactory().create({
        capabilityId:
          this.fixture.capabilityId,
        capabilityVersion:
          this.fixture.version,
        configuration:
          input.configuration,
        services:
          input.services,
        state:
          input.state,
      });

    this.context =
      this.contextFixture.context;

    this.runtime =
      input.runtime ??
      new MockCapabilityRuntime();
  }

  register(): void {
    if (
      this.runtime.registry.has(
        this.fixture.capabilityId,
      )
    ) {
      return;
    }

    this.runtime.register(
      this.fixture.provider.manifest,
      this.fixture.provider,
    );
  }

  async start(
    metadata?: CapabilityMetadata,
  ) {
    this.register();

    return this.runtime.start({
      capabilityId:
        this.fixture.capabilityId,
      metadata,
    });
  }

  async stop(
    instanceId: string,
    reason?: string,
  ) {
    return this.runtime.stop({
      instanceId,
      reason,
    });
  }

  unregister(): void {
    if (
      !this.runtime.registry.has(
        this.fixture.capabilityId,
      )
    ) {
      return;
    }

    this.runtime.unregister(
      this.fixture.capabilityId,
    );
  }

  reset(): void {
    this.fixture.lifecycle.reset();
    this.runtime.reset();
    this.contextFixture.state.clear();
    this.contextFixture.events.clear();
    this.contextFixture.logger.clear();
  }

  snapshot(): CapabilityTestingHarnessSnapshot {
    return Object.freeze({
      capabilityId:
        this.fixture.capabilityId,
      registered:
        this.runtime.registry.has(
          this.fixture.capabilityId,
        ),
      instances:
        Object.freeze([
          ...this.runtime.listInstances(),
        ]),
      lifecycle:
        this.fixture.lifecycle.snapshot(),
      runtimeCallCount:
        this.runtime.calls.count(),
      failedRuntimeCallCount:
        this.runtime.calls.failed().length,
      contextState:
        this.context.state.snapshot(),
    });
  }
}