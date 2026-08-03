import 'reflect-metadata';

import {
  CapabilityDependencyBuilder,
  CapabilityEntrypointBuilder,
  CapabilityManifestBuilder,
  CapabilityPolicyBuilder,
  CapabilityPublisherBuilder,
  PluginPackageBuilder,
} from './index';

describe('Capability SDK Builders', () => {
  const createManifest = () => {
    const publisher =
      new CapabilityPublisherBuilder()
        .name('CreatorOS')
        .organization('CreatorOS Platform')
        .website('https://creatoros.local')
        .build();

    const entrypoint =
      new CapabilityEntrypointBuilder()
        .runtime('node')
        .module('./sdk-builder-test')
        .exportName('SdkBuilderCapability')
        .build();

    const dependency =
      new CapabilityDependencyBuilder()
        .capability(
          'creatoros.capability.foundation',
        )
        .version('^1.0.0')
        .required()
        .build();

    const policy =
      new CapabilityPolicyBuilder()
        .timeoutMs(60_000)
        .maxConcurrency(4)
        .maxMemoryMb(512)
        .maxRetries(2)
        .permission(
          'capability.runtime.execute',
        )
        .networkAccess()
        .build();

    return new CapabilityManifestBuilder()
      .id(
        'creatoros.capability.sdk-builder-test',
      )
      .name('SDK Builder Test')
      .version('1.0.0')
      .description(
        'Capability created through the CreatorOS SDK builder API.',
      )
      .domain('platform')
      .kind('extension')
      .publisher(publisher)
      .entrypoint(entrypoint)
      .dependency(dependency)
      .policy(policy)
      .tags([
        'SDK',
        'Builder',
        'sdk',
      ])
      .metadata({
        source: 'sdk-test',
      })
      .build();
  };

  it('builds complete capability manifests', () => {
    const manifest = createManifest();

    expect(manifest.id).toBe(
      'creatoros.capability.sdk-builder-test',
    );

    expect(manifest.version).toBe('1.0.0');

    expect(manifest.dependencies).toHaveLength(
      1,
    );

    expect(manifest.tags).toEqual([
      'sdk',
      'builder',
    ]);

    expect(
      manifest.policy.limits?.maxConcurrency,
    ).toBe(4);

    expect(
      manifest.policy.security.networkAccess,
    ).toBe(true);
  });

  it('builds plugin packages from capability providers', () => {
    const manifest = createManifest();

    const initialize = jest.fn();
    const activate = jest.fn();
    const stop = jest.fn();

    const pluginPackage =
      new PluginPackageBuilder()
        .key(
          'creatoros.plugin.sdk-builder-test',
        )
        .name('SDK Builder Plugin')
        .description(
          'Plugin package created through SDK.',
        )
        .manifest(manifest)
        .provider({
          manifest,
          lifecycle: {
            state: 'registered',
            initialize,
            activate,
            stop,
          },
        })
        .checksum('sha256:test')
        .build();

    expect(pluginPackage.pluginKey).toBe(
      'creatoros.plugin.sdk-builder-test',
    );

    expect(pluginPackage.version).toBe(
      manifest.version,
    );

    expect(
      pluginPackage.provider.manifest,
    ).toBe(manifest);
  });

  it('rejects incomplete manifest builders', () => {
    expect(() =>
      new CapabilityManifestBuilder()
        .id(
          'creatoros.capability.incomplete',
        )
        .build(),
    ).toThrow(
      'Capability SDK builder validation failed',
    );
  });

  it('rejects unsafe entrypoint paths', () => {
    expect(() =>
      new CapabilityEntrypointBuilder()
        .runtime('node')
        .module('../../unsafe')
        .build(),
    ).toThrow(
      'Entrypoint module path is unsafe',
    );
  });

  it('rejects invalid resource policies', () => {
    expect(() =>
      new CapabilityPolicyBuilder()
        .timeoutMs(0)
        .maxConcurrency(0)
        .maxMemoryMb(1)
        .maxRetries(-1)
        .build(),
    ).toThrow(
      'Capability SDK builder validation failed',
    );
  });

  it('rejects provider and manifest mismatches', () => {
    const manifest = createManifest();

    const otherManifest =
      new CapabilityManifestBuilder()
        .id(
          'creatoros.capability.other',
        )
        .name('Other Capability')
        .version('1.0.0')
        .description(
          'Different capability manifest.',
        )
        .domain('platform')
        .kind('extension')
        .publisher({
          name: 'CreatorOS',
        })
        .entrypoint({
          runtime: 'node',
          module: './other',
        })
        .policy(
          new CapabilityPolicyBuilder().build(),
        )
        .build();

    expect(() =>
      new PluginPackageBuilder()
        .key(
          'creatoros.plugin.invalid',
        )
        .name('Invalid Plugin')
        .manifest(manifest)
        .provider({
          manifest: otherManifest,
          lifecycle: {
            state: 'registered',
            initialize: async () => undefined,
            activate: async () => undefined,
            stop: async () => undefined,
          },
        })
        .build(),
    ).toThrow(
      'provider manifest id does not match',
    );
  });
});