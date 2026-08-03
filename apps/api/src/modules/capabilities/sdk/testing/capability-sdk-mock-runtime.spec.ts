import 'reflect-metadata';

import type {
  CapabilityProvider,
} from '../../interfaces';
import {
  CapabilityEntrypointBuilder,
  CapabilityManifestBuilder,
  CapabilityPolicyBuilder,
  CapabilityPublisherBuilder,
} from '../builders';
import {
  MockCapabilityRuntime,
} from './index';

const createFixture = () => {
  const manifest =
    new CapabilityManifestBuilder()
      .id(
        'creatoros.capability.mock-runtime',
      )
      .name('Mock Runtime')
      .version('1.0.0')
      .description(
        'Capability used by the mock runtime test suite.',
      )
      .domain('platform')
      .kind('extension')
      .publisher(
        new CapabilityPublisherBuilder()
          .name('CreatorOS')
          .organization(
            'CreatorOS Platform',
          )
          .build(),
      )
      .entrypoint(
        new CapabilityEntrypointBuilder()
          .runtime('node')
          .module('./mock-runtime')
          .exportName(
            'MockRuntimeCapability',
          )
          .build(),
      )
      .policy(
        new CapabilityPolicyBuilder()
          .timeoutMs(30_000)
          .maxConcurrency(1)
          .maxMemoryMb(128)
          .maxRetries(0)
          .build(),
      )
      .tags([
        'sdk',
        'testing',
        'mock-runtime',
      ])
      .metadata({
        source: 'sdk-mock-runtime-test',
      })
      .build();

  const initialize = jest.fn(
    async () => undefined,
  );

  const activate = jest.fn(
    async () => undefined,
  );

  const stop = jest.fn(
    async () => undefined,
  );

  const provider:
    CapabilityProvider = {
      manifest,
      lifecycle: {
        state: 'registered',
        initialize,
        activate,
        stop,
      },
    };

  return {
    manifest,
    provider,
    initialize,
    activate,
    stop,
  };
};

describe('Capability SDK Mock Runtime', () => {
  it('creates manifests through the official SDK builders', () => {
    const fixture = createFixture();

    expect(
      fixture.manifest.schemaVersion,
    ).toBeDefined();

    expect(fixture.manifest.id).toBe(
      'creatoros.capability.mock-runtime',
    );

    expect(
      fixture.provider.manifest,
    ).toBe(fixture.manifest);
  });

  it('registers and retrieves capabilities', () => {
    const fixture = createFixture();
    const runtime =
      new MockCapabilityRuntime();

    runtime.register(
      fixture.manifest,
      fixture.provider,
    );

    expect(
      runtime.registry.has(
        fixture.manifest.id,
      ),
    ).toBe(true);

    expect(
      runtime.registry.require(
        fixture.manifest.id,
      ).version,
    ).toBe('1.0.0');

    expect(
      runtime.calls.count('register'),
    ).toBe(1);
  });

  it('starts capabilities through lifecycle hooks', async () => {
    const fixture = createFixture();
    const runtime =
      new MockCapabilityRuntime();

    runtime.register(
      fixture.manifest,
      fixture.provider,
    );

    const instance =
      await runtime.start({
        capabilityId:
          fixture.manifest.id,
      });

    expect(instance.state).toBe(
      'active',
    );

    expect(instance.instanceId).toBe(
      'runtime-instance-0001',
    );

    expect(
      fixture.initialize,
    ).toHaveBeenCalledTimes(1);

    expect(
      fixture.activate,
    ).toHaveBeenCalledTimes(1);

    expect(
      runtime.calls.count('start'),
    ).toBe(1);
  });

  it('stops active instances', async () => {
    const fixture = createFixture();
    const runtime =
      new MockCapabilityRuntime();

    runtime.register(
      fixture.manifest,
      fixture.provider,
    );

    const active =
      await runtime.start({
        capabilityId:
          fixture.manifest.id,
      });

    runtime.clock.advanceMinutes(5);

    const stopped =
      await runtime.stop({
        instanceId:
          active.instanceId,
        reason:
          'Test completed.',
      });

    expect(stopped.state).toBe(
      'stopped',
    );

    expect(stopped.stoppedAt).toBe(
      '2026-01-01T00:05:00.000Z',
    );

    expect(
      fixture.stop,
    ).toHaveBeenCalledTimes(1);
  });

  it('prevents unregistering active capabilities', async () => {
    const fixture = createFixture();
    const runtime =
      new MockCapabilityRuntime();

    runtime.register(
      fixture.manifest,
      fixture.provider,
    );

    await runtime.start({
      capabilityId:
        fixture.manifest.id,
    });

    expect(() =>
      runtime.unregister(
        fixture.manifest.id,
      ),
    ).toThrow(
      'has active instances',
    );
  });

  it('supports deterministic failure simulation', async () => {
    const fixture = createFixture();
    const runtime =
      new MockCapabilityRuntime();

    runtime.register(
      fixture.manifest,
      fixture.provider,
    );

    runtime.failNext(
      'start',
      new Error(
        'Planned start failure.',
      ),
      fixture.manifest.id,
    );

    await expect(
      runtime.start({
        capabilityId:
          fixture.manifest.id,
      }),
    ).rejects.toThrow(
      'Planned start failure.',
    );

    expect(
      runtime.calls.failed(),
    ).toHaveLength(1);

    const started =
      await runtime.start({
        capabilityId:
          fixture.manifest.id,
      });

    expect(started.state).toBe(
      'active',
    );
  });

  it('tracks calls by operation and capability', async () => {
    const fixture = createFixture();
    const runtime =
      new MockCapabilityRuntime();

    runtime.register(
      fixture.manifest,
      fixture.provider,
    );

    const instance =
      await runtime.start({
        capabilityId:
          fixture.manifest.id,
      });

    await runtime.stop({
      instanceId:
        instance.instanceId,
    });

    expect(
      runtime.calls.byCapability(
        fixture.manifest.id,
      ).length,
    ).toBeGreaterThanOrEqual(4);

    expect(
      runtime.calls.byOperation(
        'initialize',
      ),
    ).toHaveLength(1);

    expect(
      runtime.calls.last()?.operation,
    ).toBe('stop');
  });

  it('records lifecycle hook failures', async () => {
    const fixture = createFixture();

    fixture.activate.mockRejectedValueOnce(
      new Error(
        'Activation failed.',
      ),
    );

    const runtime =
      new MockCapabilityRuntime();

    runtime.register(
      fixture.manifest,
      fixture.provider,
    );

    await expect(
      runtime.start({
        capabilityId:
          fixture.manifest.id,
      }),
    ).rejects.toThrow(
      'Activation failed.',
    );

    expect(
      runtime.listByState('failed'),
    ).toHaveLength(1);

    expect(
      runtime.calls.failed(),
    ).toHaveLength(1);
  });

  it('unregisters stopped capabilities', async () => {
    const fixture = createFixture();
    const runtime =
      new MockCapabilityRuntime();

    runtime.register(
      fixture.manifest,
      fixture.provider,
    );

    const instance =
      await runtime.start({
        capabilityId:
          fixture.manifest.id,
      });

    await runtime.stop({
      instanceId:
        instance.instanceId,
    });

    runtime.unregister(
      fixture.manifest.id,
    );

    expect(
      runtime.registry.has(
        fixture.manifest.id,
      ),
    ).toBe(false);

    expect(
      runtime.calls.count(
        'unregister',
      ),
    ).toBe(1);
  });
});