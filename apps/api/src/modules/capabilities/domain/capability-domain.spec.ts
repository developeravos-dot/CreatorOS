import 'reflect-metadata';

import {
  CapabilityEntity,
  CapabilityIdValue,
  CapabilityLifecycleStateMachine,
  CapabilityManifestFactory,
  CapabilityVersionValue,
  createDefaultCapabilityPolicy,
} from '../capability-foundation';

describe('Capability Domain', () => {
  const manifestFactory = new CapabilityManifestFactory();

  const createManifest = () =>
    manifestFactory.create({
      id: 'creatoros.capability.domain-test',
      name: 'Domain Test Capability',
      version: '1.2.3',
      description: 'Capability domain model test.',
      domain: 'platform',
      kind: 'core',
      publisher: {
        name: 'CreatorOS',
      },
      entrypoint: {
        runtime: 'node',
        module: './domain-test',
      },
      dependencies: [],
      policy: createDefaultCapabilityPolicy(),
      tags: ['Foundation', 'Test'],
    });

  it('normalizes and validates a capability id', () => {
    const id = CapabilityIdValue.create(
      'CreatorOS.Capability.Example',
    );

    expect(id.value).toBe(
      'creatoros.capability.example',
    );
  });

  it('accepts semantic versions', () => {
    const version = CapabilityVersionValue.create(
      '2.1.0-beta.1',
    );

    expect(version.value).toBe('2.1.0-beta.1');
  });

  it('rejects invalid semantic versions', () => {
    expect(() =>
      CapabilityVersionValue.create('version-one'),
    ).toThrow('not a valid semantic version');
  });

  it('creates an immutable normalized manifest', () => {
    const manifest = createManifest();

    expect(manifest.schemaVersion).toBe('1.0.0');
    expect(manifest.id).toBe(
      'creatoros.capability.domain-test',
    );
    expect(manifest.tags).toEqual([
      'foundation',
      'test',
    ]);
    expect(Object.isFrozen(manifest)).toBe(true);
  });

  it('moves through allowed lifecycle states', () => {
    const entity = new CapabilityEntity(
      createManifest(),
    );

    entity.transitionTo('registered');
    entity.transitionTo('validated');
    entity.transitionTo('installed');

    expect(entity.state).toBe('installed');
  });

  it('rejects invalid lifecycle transitions', () => {
    const stateMachine =
      new CapabilityLifecycleStateMachine();

    expect(() =>
      stateMachine.assertTransition(
        'discovered',
        'active',
      ),
    ).toThrow(
      'transition from "discovered" to "active" is not allowed',
    );
  });
});