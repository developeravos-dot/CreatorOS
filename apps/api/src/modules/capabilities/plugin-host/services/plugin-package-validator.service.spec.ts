import 'reflect-metadata';

import {
  CapabilityManifestFactory,
  createDefaultCapabilityPolicy,
} from '../../manifest';
import {
  PluginPackageValidatorService,
} from './plugin-package-validator.service';

describe('PluginPackageValidatorService', () => {
  const factory =
    new CapabilityManifestFactory();

  it('accepts matching package and provider manifests', async () => {
    const manifest = factory.create({
      id:
        'creatoros.capability.validator-test',
      name: 'Validator Test',
      version: '1.0.0',
      description:
        'Valid plugin package validator test.',
      domain: 'platform',
      kind: 'extension',
      publisher: {
        name: 'CreatorOS',
      },
      entrypoint: {
        runtime: 'node',
        module: './validator-test',
      },
      dependencies: [],
      policy: createDefaultCapabilityPolicy(),
    });

    const validator =
      new PluginPackageValidatorService();

    await expect(
      validator.validate({
        pluginKey:
          'creatoros.plugin.validator-test',
        name: 'Validator Test',
        version: manifest.version,
        capabilityManifest: manifest,
        provider: {
          manifest,
          lifecycle: {
            state: 'registered',
            initialize: async () => undefined,
            activate: async () => undefined,
            stop: async () => undefined,
          },
        },
      }),
    ).resolves.toBeUndefined();
  });

  it('rejects mismatched package versions', async () => {
    const manifest = factory.create({
      id:
        'creatoros.capability.invalid-version',
      name: 'Invalid Version',
      version: '1.0.0',
      description:
        'Invalid plugin version package test.',
      domain: 'platform',
      kind: 'extension',
      publisher: {
        name: 'CreatorOS',
      },
      entrypoint: {
        runtime: 'node',
        module: './invalid-version',
      },
      dependencies: [],
      policy: createDefaultCapabilityPolicy(),
    });

    const validator =
      new PluginPackageValidatorService();

    await expect(
      validator.validate({
        pluginKey:
          'creatoros.plugin.invalid-version',
        name: 'Invalid Version',
        version: '2.0.0',
        capabilityManifest: manifest,
        provider: {
          manifest,
          lifecycle: {
            state: 'registered',
            initialize: async () => undefined,
            activate: async () => undefined,
            stop: async () => undefined,
          },
        },
      }),
    ).rejects.toThrow(
      'Plugin version does not match',
    );
  });
});