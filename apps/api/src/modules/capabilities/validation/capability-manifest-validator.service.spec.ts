import 'reflect-metadata';

import {
  CapabilityManifestFactory,
  createDefaultCapabilityPolicy,
} from '../manifest';
import { CapabilityManifestValidatorService } from './capability-manifest-validator.service';

describe('CapabilityManifestValidatorService', () => {
  const factory = new CapabilityManifestFactory();
  const validator =
    new CapabilityManifestValidatorService();

  it('accepts a valid manifest', async () => {
    const manifest = factory.create({
      id: 'creatoros.capability.validation-test',
      name: 'Validation Test',
      version: '1.0.0',
      description: 'Valid capability manifest for validation.',
      domain: 'platform',
      kind: 'core',
      publisher: {
        name: 'CreatorOS',
      },
      entrypoint: {
        runtime: 'node',
        module: './validation-test',
      },
      dependencies: [],
      policy: createDefaultCapabilityPolicy(),
    });

    const result =
      await validator.validateManifest(manifest);

    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('detects self dependencies', async () => {
    const manifest = factory.create({
      id: 'creatoros.capability.self-dependency',
      name: 'Self Dependency',
      version: '1.0.0',
      description: 'Capability with an invalid self dependency.',
      domain: 'platform',
      kind: 'core',
      publisher: {
        name: 'CreatorOS',
      },
      entrypoint: {
        runtime: 'node',
        module: './self-dependency',
      },
      dependencies: [
        {
          capabilityId:
            'creatoros.capability.self-dependency',
          versionRange: '^1.0.0',
          type: 'required',
        },
      ],
      policy: createDefaultCapabilityPolicy(),
    });

    const result =
      await validator.validateManifest(manifest);

    expect(result.valid).toBe(false);
    expect(
      result.issues.some(
        (issue) =>
          issue.code === 'CAPABILITY_SELF_DEPENDENCY',
      ),
    ).toBe(true);
  });

  it('detects unsafe entrypoint paths', async () => {
    const manifest = factory.create({
      id: 'creatoros.capability.unsafe-entrypoint',
      name: 'Unsafe Entrypoint',
      version: '1.0.0',
      description: 'Capability with an unsafe entrypoint path.',
      domain: 'platform',
      kind: 'core',
      publisher: {
        name: 'CreatorOS',
      },
      entrypoint: {
        runtime: 'node',
        module: '../../unsafe-module',
      },
      dependencies: [],
      policy: createDefaultCapabilityPolicy(),
    });

    const result =
      await validator.validateManifest(manifest);

    expect(result.valid).toBe(false);
    expect(
      result.issues.some(
        (issue) =>
          issue.code ===
          'CAPABILITY_ENTRYPOINT_PATH_UNSAFE',
      ),
    ).toBe(true);
  });
});