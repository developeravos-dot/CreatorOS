import { Injectable } from '@nestjs/common';

import type {
  CapabilityIdentifier,
} from '../../contracts';
import type {
  CapabilityRegistryRecord,
} from '../models/capability-registry-record';
import type {
  CapabilityRegistryRepository,
} from './capability-registry.repository';

@Injectable()
export class InMemoryCapabilityRegistryRepository
  implements CapabilityRegistryRepository
{
  private readonly records =
    new Map<CapabilityIdentifier, CapabilityRegistryRecord>();

  async save(
    record: CapabilityRegistryRecord,
  ): Promise<CapabilityRegistryRecord> {
    this.records.set(record.manifest.id, record);
    return record;
  }

  async findById(
    capabilityId: CapabilityIdentifier,
  ): Promise<CapabilityRegistryRecord | undefined> {
    return this.records.get(capabilityId);
  }

  async exists(
    capabilityId: CapabilityIdentifier,
  ): Promise<boolean> {
    return this.records.has(capabilityId);
  }

  async findAll(): Promise<
    readonly CapabilityRegistryRecord[]
  > {
    return [...this.records.values()];
  }

  async delete(
    capabilityId: CapabilityIdentifier,
  ): Promise<void> {
    this.records.delete(capabilityId);
  }

  async clear(): Promise<void> {
    this.records.clear();
  }
}