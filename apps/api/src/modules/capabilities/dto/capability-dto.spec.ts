import 'reflect-metadata';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import {
  CreateCapabilityManifestDto,
  UpdateCapabilityStateDto,
} from '../capability-foundation';

describe('Capability DTOs', () => {
  it('accepts a valid manifest payload', async () => {
    const dto = plainToInstance(
      CreateCapabilityManifestDto,
      {
        id: 'creatoros.capability.dto-test',
        name: 'DTO Test',
        version: '1.0.0',
        description: 'Valid manifest DTO.',
        domain: 'platform',
        kind: 'core',
        publisher: {
          name: 'CreatorOS',
        },
        entrypoint: {
          runtime: 'node',
          module: './dto-test',
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
        tags: ['foundation'],
      },
    );

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('rejects an invalid capability id and version', async () => {
    const dto = plainToInstance(
      CreateCapabilityManifestDto,
      {
        id: 'Invalid Capability ID',
        name: 'Invalid DTO',
        version: 'one',
        description: 'Invalid manifest.',
        domain: 'platform',
        kind: 'core',
        publisher: {
          name: 'CreatorOS',
        },
        entrypoint: {
          runtime: 'node',
          module: './invalid',
        },
        dependencies: [],
        policy: {
          security: {
            permissions: [],
          },
        },
      },
    );

    const errors = await validate(dto);

    const propertyNames = errors.map(
      (error) => error.property,
    );

    expect(propertyNames).toContain('id');
    expect(propertyNames).toContain('version');
  });

  it('accepts a valid lifecycle state update', async () => {
    const dto = plainToInstance(
      UpdateCapabilityStateDto,
      {
        state: 'active',
        reason: 'Runtime activation completed.',
      },
    );

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });
});