import 'reflect-metadata';

import {
  CapabilityManifestFactory,
  createDefaultCapabilityPolicy,
} from '../../manifest';
import {
  CapabilityAlreadyRegisteredError,
  CapabilityNotRegisteredError,
} from '../errors/capability-registry.errors';
import {
  CapabilityRegistryEngineService,
} from './capability-registry-engine.service';

describe('CapabilityRegistryEngineService', () => {
  const factory = new CapabilityManifestFactory();

  const createManifest = (
    id = 'creatoros.capability.registry-test',
  ) =>
    factory.create({
      id,
      name: 'Registry Test',
      version: '1.0.0',
      description:
        'Capability used to test the registry engine.',
      domain: 'platform',
      kind: 'core',
      publisher: {
        name: 'CreatorOS',
      },
      entrypoint: {
        runtime: 'node',
        module: './registry-test',
      },
      dependencies: [],
      policy: createDefaultCapabilityPolicy(),
    });

  it('registers and retrieves capabilities', async () => {
    const service =
      new CapabilityRegistryEngineService();

    const manifest = createManifest();

    await service.register(manifest);

    expect(await service.has(manifest.id)).toBe(true);
    expect(await service.get(manifest.id)).toEqual(
      manifest,
    );
    expect(await service.list()).toHaveLength(1);
  });

  it('stores validation and lifecycle state', async () => {
    const service =
      new CapabilityRegistryEngineService();

    const manifest = createManifest();

    await service.register(manifest);

    const record =
      await service.getRecord(manifest.id);

    expect(record?.state).toBe('registered');
    expect(record?.validation.valid).toBe(true);
  });

  it('rejects duplicate registrations', async () => {
    const service =
      new CapabilityRegistryEngineService();

    const manifest = createManifest();

    await service.register(manifest);

    await expect(
      service.register(manifest),
    ).rejects.toBeInstanceOf(
      CapabilityAlreadyRegisteredError,
    );
  });

  it('unregisters capabilities', async () => {
    const service =
      new CapabilityRegistryEngineService();

    const manifest = createManifest();

    await service.register(manifest);
    await service.unregister(manifest.id);

    expect(await service.has(manifest.id)).toBe(false);
  });

  it('rejects unregistering unknown capabilities', async () => {
    const service =
      new CapabilityRegistryEngineService();

    await expect(
      service.unregister(
        'creatoros.capability.unknown',
      ),
    ).rejects.toBeInstanceOf(
      CapabilityNotRegisteredError,
    );
  });
});