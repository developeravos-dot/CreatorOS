import { Injectable } from '@nestjs/common';

import type {
  CapabilityIdentifier,
  CapabilityManifestContract,
} from '../../contracts';
import type {
  CapabilityRegistry,
} from '../../interfaces';
import {
  CapabilityLifecycleManagerService,
} from '../../lifecycle';
import {
  CapabilityValidationPipelineService,
} from '../../validation';
import {
  CapabilityAlreadyRegisteredError,
  CapabilityNotRegisteredError,
  CapabilityRegistryValidationError,
} from '../errors/capability-registry.errors';
import type {
  CapabilityRegistryRecord,
} from '../models/capability-registry-record';
import {
  InMemoryCapabilityRegistryRepository,
} from '../repositories/in-memory-capability-registry.repository';

@Injectable()
export class CapabilityRegistryEngineService
  implements CapabilityRegistry
{
  private readonly repository:
    InMemoryCapabilityRegistryRepository;

  private readonly validationPipeline:
    CapabilityValidationPipelineService;

  private readonly lifecycleManager:
    CapabilityLifecycleManagerService;

  constructor() {
    this.repository =
      new InMemoryCapabilityRegistryRepository();

    this.validationPipeline =
      new CapabilityValidationPipelineService();

    this.lifecycleManager =
      new CapabilityLifecycleManagerService();
  }

  async register(
    manifest: CapabilityManifestContract,
  ): Promise<CapabilityManifestContract> {
    if (await this.repository.exists(manifest.id)) {
      throw new CapabilityAlreadyRegisteredError(
        manifest.id,
      );
    }

    const validation =
      await this.validationPipeline.validateManifest(
        manifest,
      );

    if (!validation.valid) {
      throw new CapabilityRegistryValidationError(
        manifest.id,
        validation.issues,
      );
    }

    await this.lifecycleManager.initialize(
      manifest.id,
      'discovered',
    );

    await this.lifecycleManager.transition({
      capabilityId: manifest.id,
      targetState: 'registered',
      reason: 'Capability accepted by registry.',
    });

    const now = new Date().toISOString();

    const record: CapabilityRegistryRecord = {
      manifest,
      state: 'registered',
      validation,
      registeredAt: now,
      updatedAt: now,
    };

    await this.repository.save(record);

    return manifest;
  }

  async unregister(
    capabilityId: CapabilityIdentifier,
  ): Promise<void> {
    const record =
      await this.repository.findById(capabilityId);

    if (!record) {
      throw new CapabilityNotRegisteredError(
        capabilityId,
      );
    }

    await this.repository.delete(capabilityId);
    await this.lifecycleManager.reset(capabilityId);
  }

  async get(
    capabilityId: CapabilityIdentifier,
  ): Promise<CapabilityManifestContract | undefined> {
    return (
      await this.repository.findById(capabilityId)
    )?.manifest;
  }

  async getRecord(
    capabilityId: CapabilityIdentifier,
  ): Promise<CapabilityRegistryRecord | undefined> {
    return this.repository.findById(capabilityId);
  }

  async has(
    capabilityId: CapabilityIdentifier,
  ): Promise<boolean> {
    return this.repository.exists(capabilityId);
  }

  async list(): Promise<
    readonly CapabilityManifestContract[]
  > {
    const records =
      await this.repository.findAll();

    return records.map((record) => record.manifest);
  }

  async listRecords(): Promise<
    readonly CapabilityRegistryRecord[]
  > {
    return this.repository.findAll();
  }

  async clear(): Promise<void> {
    const records =
      await this.repository.findAll();

    await this.repository.clear();

    await Promise.all(
      records.map((record) =>
        this.lifecycleManager.reset(
          record.manifest.id,
        ),
      ),
    );
  }
}
