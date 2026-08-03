import 'reflect-metadata';

import {
  PluginHostEngineService,
} from '../../../plugin-host';
import {
  CapabilityEntrypointBuilder,
  CapabilityManifestBuilder,
  CapabilityPolicyBuilder,
  CapabilityPublisherBuilder,
  PluginPackageBuilder,
} from '../index';

describe('SDK Plugin Builder Integration', () => {
  it('creates packages accepted by Plugin Host', async () => {
    const manifest =
      new CapabilityManifestBuilder()
        .id(
          'creatoros.capability.sdk-host-integration',
        )
        .name(
          'SDK Host Integration',
        )
        .version('1.0.0')
        .description(
          'Capability built by SDK and installed through Plugin Host.',
        )
        .domain('platform')
        .kind('extension')
        .publisher(
          new CapabilityPublisherBuilder()
            .name('CreatorOS')
            .build(),
        )
        .entrypoint(
          new CapabilityEntrypointBuilder()
            .runtime('node')
            .module(
              './sdk-host-integration',
            )
            .build(),
        )
        .policy(
          new CapabilityPolicyBuilder().build(),
        )
        .build();

    const pluginPackage =
      new PluginPackageBuilder()
        .key(
          'creatoros.plugin.sdk-host-integration',
        )
        .name(
          'SDK Host Integration',
        )
        .manifest(manifest)
        .provider({
          manifest,
          lifecycle: {
            state: 'registered',
            initialize: async () => undefined,
            activate: async () => undefined,
            stop: async () => undefined,
          },
        })
        .build();

    const host =
      new PluginHostEngineService();

    const installed = await host.install({
      package: pluginPackage,
    });

    expect(installed.currentState).toBe(
      'installed',
    );

    const activated = await host.activate({
      pluginKey:
        pluginPackage.pluginKey,
    });

    expect(activated.currentState).toBe(
      'active',
    );

    expect(
      activated.runtimeInstanceId,
    ).toBeTruthy();
  });
});