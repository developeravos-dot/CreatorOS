import 'reflect-metadata';

import {
  CapabilityManifestFactory,
  createDefaultCapabilityPolicy,
} from '../../manifest';
import type {
  PluginPackageContract,
} from '../contracts';
import {
  PluginAlreadyInstalledError,
  PluginUninstallBlockedError,
} from '../errors/plugin-host.errors';
import {
  PluginHostEngineService,
} from './plugin-host-engine.service';

describe('PluginHostEngineService', () => {
  const manifestFactory =
    new CapabilityManifestFactory();

  const createPackage = (
    pluginKey =
      'creatoros.plugin.host-test',
  ): PluginPackageContract => {
    const manifest = manifestFactory.create({
      id:
        'creatoros.capability.plugin-host-test',
      name: 'Plugin Host Test',
      version: '1.0.0',
      description:
        'Plugin package used to test the CreatorOS plugin host.',
      domain: 'platform',
      kind: 'extension',
      publisher: {
        name: 'CreatorOS',
      },
      entrypoint: {
        runtime: 'node',
        module: './plugin-host-test',
      },
      dependencies: [],
      policy: createDefaultCapabilityPolicy(),
    });

    return {
      pluginKey,
      name: 'Plugin Host Test',
      version: manifest.version,
      description:
        'Plugin Host integration test package.',
      capabilityManifest: manifest,
      provider: {
        manifest,
        lifecycle: {
          state: 'registered',
          initialize: jest.fn(),
          activate: jest.fn(),
          stop: jest.fn(),
        },
      },
    };
  };

  it('installs valid plugin packages', async () => {
    const host =
      new PluginHostEngineService();

    const pluginPackage = createPackage();

    const result = await host.install({
      package: pluginPackage,
    });

    expect(result.currentState).toBe(
      'installed',
    );

    expect(
      await host.getInstalled(
        pluginPackage.pluginKey,
      ),
    ).toMatchObject({
      pluginKey:
        pluginPackage.pluginKey,
      state: 'installed',
    });
  });

  it('rejects duplicate installations', async () => {
    const host =
      new PluginHostEngineService();

    const pluginPackage = createPackage();

    await host.install({
      package: pluginPackage,
    });

    await expect(
      host.install({
        package: pluginPackage,
      }),
    ).rejects.toBeInstanceOf(
      PluginAlreadyInstalledError,
    );
  });

  it('activates installed plugins', async () => {
    const host =
      new PluginHostEngineService();

    const pluginPackage = createPackage();

    await host.install({
      package: pluginPackage,
    });

    const result = await host.activate({
      pluginKey:
        pluginPackage.pluginKey,
    });

    expect(result.currentState).toBe(
      'active',
    );

    expect(
      result.runtimeInstanceId,
    ).toBeTruthy();

    expect(
      pluginPackage.provider.lifecycle
        .initialize,
    ).toHaveBeenCalledTimes(1);

    expect(
      pluginPackage.provider.lifecycle
        .activate,
    ).toHaveBeenCalledTimes(1);
  });

  it('deactivates active plugins', async () => {
    const host =
      new PluginHostEngineService();

    const pluginPackage = createPackage();

    await host.install({
      package: pluginPackage,
    });

    await host.activate({
      pluginKey:
        pluginPackage.pluginKey,
    });

    const result = await host.deactivate({
      pluginKey:
        pluginPackage.pluginKey,
      reason: 'Test completed.',
    });

    expect(result.currentState).toBe(
      'inactive',
    );

    expect(
      pluginPackage.provider.lifecycle.stop,
    ).toHaveBeenCalledTimes(1);
  });

  it('blocks uninstalling active plugins without force', async () => {
    const host =
      new PluginHostEngineService();

    const pluginPackage = createPackage();

    await host.install({
      package: pluginPackage,
    });

    await host.activate({
      pluginKey:
        pluginPackage.pluginKey,
    });

    await expect(
      host.uninstall({
        pluginKey:
          pluginPackage.pluginKey,
      }),
    ).rejects.toBeInstanceOf(
      PluginUninstallBlockedError,
    );
  });

  it('force uninstalls active plugins', async () => {
    const host =
      new PluginHostEngineService();

    const pluginPackage = createPackage();

    await host.install({
      package: pluginPackage,
    });

    await host.activate({
      pluginKey:
        pluginPackage.pluginKey,
    });

    const result = await host.uninstall({
      pluginKey:
        pluginPackage.pluginKey,
      force: true,
    });

    expect(result.changed).toBe(true);

    expect(
      await host.getInstalled(
        pluginPackage.pluginKey,
      ),
    ).toBeUndefined();
  });
});