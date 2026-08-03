import 'reflect-metadata';

import {
  CapabilityManifestFactory,
  createDefaultCapabilityPolicy,
} from '../../manifest';
import {
  CapabilityRegistryEngineService,
} from '../../registry-engine';
import {
  CapabilityRuntimeAdapterRegistryService,
} from './capability-runtime-adapter-registry.service';
import {
  CapabilityRuntimeEngineService,
} from './capability-runtime-engine.service';
import {
  InMemoryCapabilityRuntimeAdapter,
} from './in-memory-capability-runtime-adapter';

describe('CapabilityRuntimeEngineService', () => {
  const manifestFactory =
    new CapabilityManifestFactory();

  const createManifest = () =>
    manifestFactory.create({
      id: 'creatoros.capability.runtime-test',
      name: 'Runtime Test',
      version: '1.0.0',
      description:
        'Capability used to test runtime execution.',
      domain: 'platform',
      kind: 'core',
      publisher: {
        name: 'CreatorOS',
      },
      entrypoint: {
        runtime: 'node',
        module: './runtime-test',
      },
      dependencies: [],
      policy: createDefaultCapabilityPolicy(),
    });

  const createRuntime = async () => {
    const manifest = createManifest();

    const registry =
      new CapabilityRegistryEngineService();

    await registry.register(manifest);

    const adapterRegistry =
      new CapabilityRuntimeAdapterRegistryService();

    const adapter =
      new InMemoryCapabilityRuntimeAdapter();

    const initialize = jest.fn();
    const activate = jest.fn();
    const stop = jest.fn();

    adapter.registerProvider(
      manifest.entrypoint.module,
      {
        manifest,
        lifecycle: {
          state: 'registered',
          initialize,
          activate,
          stop,
        },
      },
    );

    adapterRegistry.register(adapter);

    const runtime =
      new CapabilityRuntimeEngineService(
        registry,
        adapterRegistry,
      );

    return {
      manifest,
      runtime,
      initialize,
      activate,
      stop,
    };
  };

  it('starts registered capabilities', async () => {
    const {
      manifest,
      runtime,
      initialize,
      activate,
    } = await createRuntime();

    const result = await runtime.start({
      capabilityId: manifest.id,
    });

    expect(result.currentStatus).toBe(
      'running',
    );

    expect(result.lifecycleState).toBe(
      'active',
    );

    expect(initialize).toHaveBeenCalledTimes(1);
    expect(activate).toHaveBeenCalledTimes(1);
    expect(runtime.listInstances()).toHaveLength(1);
  });

  it('stops running capabilities', async () => {
    const {
      manifest,
      runtime,
      stop,
    } = await createRuntime();

    const started = await runtime.start({
      capabilityId: manifest.id,
    });

    const result = await runtime.stop({
      instanceId: started.instanceId,
      reason: 'Test completed.',
    });

    expect(result.currentStatus).toBe(
      'stopped',
    );

    expect(result.lifecycleState).toBe(
      'stopped',
    );

    expect(stop).toHaveBeenCalledTimes(1);
  });

  it('returns default health when provider has no health check', async () => {
    const {
      manifest,
      runtime,
    } = await createRuntime();

    const started = await runtime.start({
      capabilityId: manifest.id,
    });

    const health =
      await runtime.healthCheck(
        started.instanceId,
      );

    expect(health.report.status).toBe(
      'healthy',
    );
  });

  it('rejects starting the same capability twice', async () => {
    const {
      manifest,
      runtime,
    } = await createRuntime();

    await runtime.start({
      capabilityId: manifest.id,
    });

    await expect(
      runtime.start({
        capabilityId: manifest.id,
      }),
    ).rejects.toThrow(
      'already has an active runtime instance',
    );
  });
});