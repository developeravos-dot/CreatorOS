import 'reflect-metadata';

import {
  CAPABILITY_MANIFEST_SCHEMA_VERSION,
  type CapabilityManifestContract,
  type CapabilityRegistry,
} from './capability-foundation';

describe('Capability Foundation', () => {
  it('defines a valid capability manifest contract', () => {
    const manifest: CapabilityManifestContract = {
      schemaVersion: CAPABILITY_MANIFEST_SCHEMA_VERSION,
      id: 'creatoros.capability.example',
      name: 'Example Capability',
      version: '1.0.0',
      description: 'Example capability used to verify foundation contracts.',
      domain: 'platform',
      kind: 'core',
      publisher: {
        name: 'CreatorOS',
      },
      entrypoint: {
        runtime: 'node',
        module: './example-capability',
      },
      dependencies: [],
      policy: {
        security: {
          permissions: [],
          networkAccess: false,
          filesystemAccess: false,
          environmentAccess: false,
          processAccess: false,
        },
      },
    };

    expect(manifest.schemaVersion).toBe('1.0.0');
    expect(manifest.id).toBe('creatoros.capability.example');
  });

  it('defines the registry abstraction without requiring an implementation', () => {
    const registryMethodNames: ReadonlyArray<keyof CapabilityRegistry> = [
      'register',
      'unregister',
      'get',
      'has',
      'list',
    ];

    expect(registryMethodNames).toEqual([
      'register',
      'unregister',
      'get',
      'has',
      'list',
    ]);
  });
});