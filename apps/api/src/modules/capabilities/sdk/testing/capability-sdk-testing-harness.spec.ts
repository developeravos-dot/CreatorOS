import 'reflect-metadata';

import {
  assertCapabilityNotRegistered,
  assertCapabilityRegistered,
  assertInstanceState,
  assertLifecycleCallOrder,
  assertNoRuntimeFailures,
  assertRuntimeCallCount,
  assertRuntimeFailureCount,
  CapabilityTestFixtureBuilder,
  CapabilityTestingHarnessBuilder,
  DefaultCapabilityTestingHarness,
} from './index';

describe('Capability SDK Testing Harness', () => {
  it('creates production-valid capability fixtures', () => {
    const fixture =
      new CapabilityTestFixtureBuilder()
        .capabilityId(
          'creatoros.capability.harness-fixture',
        )
        .name('Harness Fixture')
        .version('1.2.0')
        .build();

    expect(
      fixture.provider.manifest.schemaVersion,
    ).toBeDefined();

    expect(
      fixture.provider.manifest.id,
    ).toBe(
      'creatoros.capability.harness-fixture',
    );

    expect(
      fixture.provider.manifest.version,
    ).toBe('1.2.0');
  });

  it('creates configured harnesses through builder API', () => {
    const harness =
      new CapabilityTestingHarnessBuilder()
        .capability(
          'creatoros.capability.builder-harness',
          '1.0.0',
        )
        .configuration({
          environment: 'test',
        })
        .state({
          executions: 0,
        })
        .build();

    expect(
      harness.context.configuration.get(
        'environment',
      ),
    ).toBe('test');

    expect(
      harness.context.state.get(
        'executions',
      ),
    ).toBe(0);
  });

  it('registers capabilities idempotently', () => {
    const harness =
      new DefaultCapabilityTestingHarness();

    assertCapabilityNotRegistered(
      harness,
    );

    harness.register();
    harness.register();

    assertCapabilityRegistered(harness);

    assertRuntimeCallCount(
      harness,
      'register',
      1,
    );
  });

  it('runs a complete start and stop lifecycle', async () => {
    const harness =
      new DefaultCapabilityTestingHarness();

    const instance =
      await harness.start({
        testRun: 'complete-lifecycle',
      });

    assertInstanceState(
      harness,
      instance.instanceId,
      'active',
    );

    assertLifecycleCallOrder(
      harness,
      [
        'initialize',
        'activate',
      ],
    );

    await harness.stop(
      instance.instanceId,
      'Test completed.',
    );

    assertInstanceState(
      harness,
      instance.instanceId,
      'stopped',
    );

    assertLifecycleCallOrder(
      harness,
      [
        'initialize',
        'activate',
        'stop',
      ],
    );

    assertNoRuntimeFailures(harness);
  });

  it('tracks lifecycle failures through the harness', async () => {
    const harness =
      new DefaultCapabilityTestingHarness();

    harness.fixture.lifecycle
      .failNextActivate(
        new Error(
          'Harness activation failure.',
        ),
      );

    await expect(
      harness.start(),
    ).rejects.toThrow(
      'Harness activation failure.',
    );

    assertRuntimeFailureCount(
      harness,
      1,
    );

    expect(
      harness.snapshot()
        .failedRuntimeCallCount,
    ).toBe(1);
  });

  it('supports runtime-level failure simulation', async () => {
    const harness =
      new DefaultCapabilityTestingHarness();

    harness.register();

    harness.runtime.failNext(
      'start',
      new Error(
        'Runtime start rejected.',
      ),
      harness.fixture.capabilityId,
    );

    await expect(
      harness.start(),
    ).rejects.toThrow(
      'Runtime start rejected.',
    );

    assertRuntimeFailureCount(
      harness,
      1,
    );
  });

  it('produces complete harness snapshots', async () => {
    const harness =
      new CapabilityTestingHarnessBuilder()
        .state({
          status: 'ready',
        })
        .build();

    const instance =
      await harness.start();

    const snapshot =
      harness.snapshot();

    expect(snapshot.registered).toBe(
      true,
    );

    expect(snapshot.instances).toHaveLength(
      1,
    );

    expect(
      snapshot.instances[0]?.instanceId,
    ).toBe(instance.instanceId);

    expect(snapshot.contextState).toEqual({
      status: 'ready',
    });

    expect(
      snapshot.runtimeCallCount,
    ).toBeGreaterThanOrEqual(4);
  });

  it('resets runtime, lifecycle and context state', async () => {
    const harness =
      new CapabilityTestingHarnessBuilder()
        .state({
          count: 10,
        })
        .build();

    await harness.start();

    harness.contextFixture.logger.info(
      'Reset test.',
    );

    await harness.contextFixture.events.publish({
      type: 'harness.reset.test',
    });

    harness.reset();

    expect(
      harness.runtime.registry.size(),
    ).toBe(0);

    expect(
      harness.runtime.listInstances(),
    ).toHaveLength(0);

    expect(
      harness.context.state.snapshot(),
    ).toEqual({});

    expect(
      harness.contextFixture.logger
        .getEntries(),
    ).toHaveLength(0);

    expect(
      harness.contextFixture.events
        .getEvents(),
    ).toHaveLength(0);

    expect(
      harness.fixture.lifecycle
        .snapshot()
        .callOrder,
    ).toEqual([]);
  });

  it('unregisters capabilities after instances stop', async () => {
    const harness =
      new DefaultCapabilityTestingHarness();

    const instance =
      await harness.start();

    await harness.stop(
      instance.instanceId,
    );

    harness.unregister();

    assertCapabilityNotRegistered(
      harness,
    );

    assertRuntimeCallCount(
      harness,
      'unregister',
      1,
    );
  });
});